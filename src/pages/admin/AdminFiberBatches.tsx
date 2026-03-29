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
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';

const STATUSES = ['raw', 'scoured', 'combed', 'ready'];
const STATUS_COLORS: Record<string, string> = {
  raw: 'bg-muted text-muted-foreground',
  scoured: 'bg-blue-100 text-blue-800',
  combed: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-800',
};

const AdminFiberBatches = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [growers, setGrowers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    batch_code: '', harvest_date: '', weight_kg: '', micron_avg: '',
    grade: '', region: '', grower_id: '', processing_status: 'raw', notes: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [bRes, gRes] = await Promise.all([
      supabase.from('fiber_batches').select('*, grower:growers(farm_name)').order('harvest_date', { ascending: false }),
      supabase.from('growers').select('id, farm_name').order('farm_name'),
    ]);
    setBatches(bRes.data ?? []);
    setGrowers(gRes.data ?? []);
  };

  const generateCode = () => {
    const now = new Date();
    return `PA-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  };

  const openNew = () => {
    setForm({
      batch_code: generateCode(), harvest_date: new Date().toISOString().split('T')[0],
      weight_kg: '', micron_avg: '', grade: '', region: '', grower_id: '',
      processing_status: 'raw', notes: '',
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    const data: any = {
      batch_code: form.batch_code,
      harvest_date: form.harvest_date,
      processing_status: form.processing_status,
    };
    if (form.weight_kg) data.weight_kg = parseFloat(form.weight_kg);
    if (form.micron_avg) data.micron_avg = parseFloat(form.micron_avg);
    if (form.grade) data.grade = form.grade;
    if (form.region) data.region = form.region;
    if (form.grower_id) data.grower_id = form.grower_id;
    if (form.notes) data.notes = form.notes;

    const { error } = await supabase.from('fiber_batches').insert(data);
    if (error) { toast.error(error.message); return; }
    toast.success('批次已创建');
    setFormOpen(false);
    loadData();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('fiber_batches').update({ processing_status: status }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('状态已更新');
    loadData();
  };

  const filtered = batches.filter(b => b.batch_code?.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">纤维批次</h1>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" />新建批次</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="搜索批次号..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>批次编号</TableHead>
                <TableHead>养殖户</TableHead>
                <TableHead>收获日期</TableHead>
                <TableHead>重量</TableHead>
                <TableHead>微米</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.batch_code}</TableCell>
                  <TableCell>{(b.grower as any)?.farm_name || '—'}</TableCell>
                  <TableCell>{new Date(b.harvest_date).toLocaleDateString('zh-CN')}</TableCell>
                  <TableCell>{b.weight_kg ?? '—'} kg</TableCell>
                  <TableCell>{b.micron_avg ?? '—'} μm</TableCell>
                  <TableCell>
                    <Select value={b.processing_status || 'raw'} onValueChange={v => updateStatus(b.id, v)}>
                      <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>新建纤维批次</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>批次编号</Label><Input value={form.batch_code} onChange={e => setForm(p => ({ ...p, batch_code: e.target.value }))} /></div>
            <div><Label>收获日期</Label><Input type="date" value={form.harvest_date} onChange={e => setForm(p => ({ ...p, harvest_date: e.target.value }))} /></div>
            <div>
              <Label>养殖户</Label>
              <Select value={form.grower_id || 'none'} onValueChange={v => setForm(p => ({ ...p, grower_id: v === 'none' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="选择养殖户" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未关联</SelectItem>
                  {growers.map(g => <SelectItem key={g.id} value={g.id}>{g.farm_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>重量(kg)</Label><Input type="number" value={form.weight_kg} onChange={e => setForm(p => ({ ...p, weight_kg: e.target.value }))} /></div>
              <div><Label>微米数</Label><Input type="number" value={form.micron_avg} onChange={e => setForm(p => ({ ...p, micron_avg: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>等级</Label><Input value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} /></div>
              <div><Label>地区</Label><Input value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))} /></div>
            </div>
            <Button className="w-full" onClick={handleSave}>创建批次</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFiberBatches;
