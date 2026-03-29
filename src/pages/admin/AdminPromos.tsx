import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const AdminPromos = () => {
  const [promos, setPromos] = useState<any[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    code: '', discount_type: 'percentage', discount_value: '', min_order_nzd: '0',
    usage_limit: '', expires_at: '',
  });

  useEffect(() => { loadPromos(); }, []);

  const loadPromos = async () => {
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    setPromos(data ?? []);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('promo_codes').update({ is_active: active }).eq('id', id);
    loadPromos();
  };

  const handleCreate = async () => {
    const data: any = {
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value) || 0,
      min_order_nzd: parseFloat(form.min_order_nzd) || 0,
    };
    if (form.usage_limit) data.usage_limit = parseInt(form.usage_limit);
    if (form.expires_at) data.expires_at = form.expires_at;

    const { error } = await supabase.from('promo_codes').insert(data);
    if (error) { toast.error(error.message); return; }
    toast.success('促销码已创建');
    setFormOpen(false);
    loadPromos();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">促销码管理</h1>
        <Button onClick={() => setFormOpen(true)}><Plus className="w-4 h-4 mr-1" />新建</Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>代码</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>值</TableHead>
                <TableHead>最低消费</TableHead>
                <TableHead>已用/限制</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono">{p.code}</TableCell>
                  <TableCell>{p.discount_type === 'percentage' ? '百分比' : '固定金额'}</TableCell>
                  <TableCell>{p.discount_type === 'percentage' ? `${p.discount_value}%` : `NZ$${p.discount_value}`}</TableCell>
                  <TableCell>NZ${Number(p.min_order_nzd || 0).toFixed(0)}</TableCell>
                  <TableCell>{p.used_count || 0}/{p.usage_limit || '∞'}</TableCell>
                  <TableCell>
                    <Switch checked={p.is_active} onCheckedChange={v => toggleActive(p.id, v)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>新建促销码</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>代码</Label><Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="如：WELCOME10" /></div>
            <div>
              <Label>折扣类型</Label>
              <Select value={form.discount_type} onValueChange={v => setForm(p => ({ ...p, discount_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">百分比</SelectItem>
                  <SelectItem value="fixed">固定金额(NZD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>折扣值</Label><Input type="number" value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))} /></div>
            <div><Label>最低消费(NZD)</Label><Input type="number" value={form.min_order_nzd} onChange={e => setForm(p => ({ ...p, min_order_nzd: e.target.value }))} /></div>
            <div><Label>使用限制</Label><Input type="number" value={form.usage_limit} onChange={e => setForm(p => ({ ...p, usage_limit: e.target.value }))} placeholder="留空=无限" /></div>
            <div><Label>过期时间</Label><Input type="datetime-local" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} /></div>
            <Button className="w-full" onClick={handleCreate}>创建</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPromos;
