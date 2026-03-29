import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, Plus, Eye } from 'lucide-react';

const AdminGrowers = () => {
  const [growers, setGrowers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [creditForm, setCreditForm] = useState({ amount: '', description: '', type: 'adjustment' });
  const [showCredit, setShowCredit] = useState(false);

  useEffect(() => { loadGrowers(); }, []);

  const loadGrowers = async () => {
    const { data } = await supabase.from('growers').select('*').order('farm_name');
    setGrowers(data ?? []);
  };

  const viewGrower = async (g: any) => {
    setSelected(g);
    const { data } = await supabase.from('fiber_batches').select('*').eq('grower_id', g.id).order('harvest_date', { ascending: false });
    setBatches(data ?? []);
  };

  const addCredit = async () => {
    if (!selected || !creditForm.amount) return;
    const { error } = await supabase.from('grower_transactions').insert({
      grower_id: selected.id,
      amount_nzd: parseFloat(creditForm.amount),
      type: creditForm.type as 'purchase' | 'adjustment' | 'payout' | 'bonus',
      description: creditForm.description || '管理员手动操作',
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Credit 已更新');
    setCreditForm({ amount: '', description: '', type: 'adjustment' });
    setShowCredit(false);
    loadGrowers();
  };

  const filtered = growers.filter(g =>
    g.farm_name?.includes(search) || g.owner_name?.includes(search) || g.region?.includes(search)
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">养殖户管理</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="搜索养殖户..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>农场名称</TableHead>
                <TableHead>地区</TableHead>
                <TableHead>Credit 余额</TableHead>
                <TableHead>羊驼数</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(g => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.farm_name}</TableCell>
                  <TableCell>{g.region}</TableCell>
                  <TableCell>NZ${Number(g.credit_balance || 0).toFixed(2)}</TableCell>
                  <TableCell>{g.alpaca_count || 0}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => viewGrower(g)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(g); setShowCredit(true); }}><Plus className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grower detail */}
      <Dialog open={!!selected && !showCredit} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selected?.farm_name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">业主：</span>{selected.owner_name}</div>
                <div><span className="text-muted-foreground">地区：</span>{selected.region}</div>
                <div><span className="text-muted-foreground">Credit：</span>NZ${Number(selected.credit_balance || 0).toFixed(2)}</div>
                <div><span className="text-muted-foreground">羊驼数：</span>{selected.alpaca_count || 0}</div>
              </div>
              <h4 className="font-medium text-sm">纤维批次 ({batches.length})</h4>
              {batches.map(b => (
                <div key={b.id} className="text-xs border-b py-2 flex justify-between">
                  <span>{b.batch_code}</span>
                  <span>{b.weight_kg}kg · {b.processing_status}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Credit — B03: type dropdown uses valid DB enum values */}
      <Dialog open={showCredit} onOpenChange={setShowCredit}>
        <DialogContent>
          <DialogHeader><DialogTitle>调整 Credit — {selected?.farm_name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>类型</Label>
              <Select value={creditForm.type} onValueChange={v => setCreditForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">收购款</SelectItem>
                  <SelectItem value="adjustment">手动调整</SelectItem>
                  <SelectItem value="payout">已结算</SelectItem>
                  <SelectItem value="bonus">奖励</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>金额 (NZD)，负数表示扣减</Label><Input type="number" value={creditForm.amount} onChange={e => setCreditForm(p => ({ ...p, amount: e.target.value }))} /></div>
            <div><Label>描述</Label><Input value={creditForm.description} onChange={e => setCreditForm(p => ({ ...p, description: e.target.value }))} placeholder="如：2024年6月羊毛款" /></div>
            <Button onClick={addCredit} className="w-full">确认</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGrowers;
