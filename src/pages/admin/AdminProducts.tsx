import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Pencil, Search } from 'lucide-react';

const CATEGORIES = ['duvet', 'coat', 'vest', 'scarf', 'blanket', 'pillow'];
const TIERS = ['classic', 'luxury', 'premium', 'cloud_of_dreams'];

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [pRes, bRes] = await Promise.all([
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('fiber_batches').select('id, batch_code'),
    ]);
    setProducts(pRes.data ?? []);
    setBatches(bRes.data ?? []);
  };

  const openNew = () => {
    setEditing({
      name_zh: '', name_en: '', slug: '', category: 'duvet', tier: 'classic',
      description_zh: '', description_en: '', price_nzd: 0, stock: 0,
      fill_material: '', fabric_material: '', is_active: true, is_featured: false, sort_order: 0,
    });
    setFormOpen(true);
  };

  const openEdit = (p: any) => { setEditing({ ...p }); setFormOpen(true); };

  const handleSave = async () => {
    if (!editing) return;
    const data = { ...editing };
    delete data.id;
    delete data.created_at;
    delete data.updated_at;
    delete data.images;
    delete data.size_options;
    delete data.color_options;
    delete data.certifications;
    delete data.weight_grams;

    if (editing.id) {
      const { error } = await supabase.from('products').update(data).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('产品已更新');
    } else {
      if (!data.slug) data.slug = data.name_en.toLowerCase().replace(/\s+/g, '-');
      const { error } = await supabase.from('products').insert(data);
      if (error) { toast.error(error.message); return; }
      toast.success('产品已创建');
    }
    setFormOpen(false);
    loadData();
  };

  const filtered = products.filter(p =>
    p.name_zh?.includes(search) || p.name_en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">产品管理</h1>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-1" />新建产品</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="搜索产品..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>库存</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.name_zh}</TableCell>
                  <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                  <TableCell>NZ${Number(p.price_nzd).toFixed(0)}</TableCell>
                  <TableCell className={p.stock < 5 ? 'text-destructive font-bold' : ''}>{p.stock}</TableCell>
                  <TableCell><Badge variant={p.is_active ? 'default' : 'outline'}>{p.is_active ? '上架' : '下架'}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? '编辑产品' : '新建产品'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>中文名称</Label><Input value={editing.name_zh} onChange={e => setEditing((p: any) => ({ ...p, name_zh: e.target.value }))} /></div>
                <div><Label>英文名称</Label><Input value={editing.name_en} onChange={e => setEditing((p: any) => ({ ...p, name_en: e.target.value }))} /></div>
              </div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={e => setEditing((p: any) => ({ ...p, slug: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>分类</Label>
                  <Select value={editing.category} onValueChange={v => setEditing((p: any) => ({ ...p, category: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>等级</Label>
                  <Select value={editing.tier || ''} onValueChange={v => setEditing((p: any) => ({ ...p, tier: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TIERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>价格 (NZD)</Label><Input type="number" value={editing.price_nzd} onChange={e => setEditing((p: any) => ({ ...p, price_nzd: parseFloat(e.target.value) || 0 }))} /></div>
                <div><Label>库存</Label><Input type="number" value={editing.stock} onChange={e => setEditing((p: any) => ({ ...p, stock: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <div><Label>中文描述</Label><Textarea value={editing.description_zh || ''} onChange={e => setEditing((p: any) => ({ ...p, description_zh: e.target.value }))} rows={3} /></div>
              <div><Label>英文描述</Label><Textarea value={editing.description_en || ''} onChange={e => setEditing((p: any) => ({ ...p, description_en: e.target.value }))} rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>填充材料</Label><Input value={editing.fill_material || ''} onChange={e => setEditing((p: any) => ({ ...p, fill_material: e.target.value }))} /></div>
                <div><Label>面料材料</Label><Input value={editing.fabric_material || ''} onChange={e => setEditing((p: any) => ({ ...p, fabric_material: e.target.value }))} /></div>
              </div>
              <div>
                <Label>关联纤维批次</Label>
                <Select value={editing.fiber_batch_id || 'none'} onValueChange={v => setEditing((p: any) => ({ ...p, fiber_batch_id: v === 'none' ? null : v }))}>
                  <SelectTrigger><SelectValue placeholder="选择批次" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无</SelectItem>
                    {batches.map(b => <SelectItem key={b.id} value={b.id}>{b.batch_code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSave}>保存</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
