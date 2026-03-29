import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Search, Eye } from 'lucide-react';

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-green-200 text-green-900',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [tracking, setTracking] = useState('');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
    setOrders(data ?? []);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('状态已更新');
    loadOrders();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const saveTracking = async () => {
    if (!selected) return;
    const { error } = await supabase.from('orders').update({ tracking_number: tracking }).eq('id', selected.id);
    if (error) { toast.error(error.message); return; }
    toast.success('物流单号已保存');
    setSelected({ ...selected, tracking_number: tracking });
    loadOrders();
  };

  const filtered = orders.filter(o =>
    o.order_number?.includes(search) || o.customer_email?.includes(search) || o.customer_name?.includes(search)
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">订单管理</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="搜索订单号/客户..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="overflow-x-auto pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString('zh-CN')}</TableCell>
                  <TableCell>{o.customer_name || o.customer_email}</TableCell>
                  <TableCell>NZ${Number(o.total_nzd || 0).toFixed(0)}</TableCell>
                  <TableCell>
                    <Select value={o.status || 'pending'} onValueChange={v => updateStatus(o.id, v)}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(o); setTracking(o.tracking_number || ''); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>订单详情</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">订单号：</span>{selected.order_number}</div>
                <div><span className="text-muted-foreground">日期：</span>{new Date(selected.created_at).toLocaleString('zh-CN')}</div>
                <div><span className="text-muted-foreground">客户：</span>{selected.customer_name}</div>
                <div><span className="text-muted-foreground">邮箱：</span>{selected.customer_email}</div>
                <div><span className="text-muted-foreground">总额：</span>NZ${Number(selected.total_nzd || 0).toFixed(2)}</div>
                <div><span className="text-muted-foreground">状态：</span><Badge className={STATUS_COLORS[selected.status || 'pending']}>{selected.status}</Badge></div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium mb-2">商品</h4>
                {Array.isArray(selected.items) ? selected.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between py-1 border-b last:border-0">
                    <span>{item.name} × {item.qty}</span>
                    <span>NZ${Number(item.price || 0).toFixed(0)}</span>
                  </div>
                )) : <p className="text-muted-foreground">无商品信息</p>}
              </div>

              {/* Tracking */}
              <div className="space-y-2">
                <Label>物流单号</Label>
                <div className="flex gap-2">
                  <Input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="输入物流单号" />
                  <Button onClick={saveTracking}>保存</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
