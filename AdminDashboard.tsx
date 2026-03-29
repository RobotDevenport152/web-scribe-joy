import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ todayOrders: 0, todayRevenue: 0 });
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const today = new Date().toISOString().split('T')[0];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [ordersRes, productsRes, recentRes, monthlyRes] = await Promise.all([
      supabase.from('orders').select('*').gte('created_at', today),
      supabase.from('products').select('id, name_zh, stock_quantity, price_nzd').lt('stock_quantity', 5).eq('is_active', true),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
      // B15: separate query for full monthly chart (not limited to 10 rows)
      supabase.from('orders').select('created_at, total_nzd').gte('created_at', sixMonthsAgo.toISOString()),
    ]);

    const todayOrders = ordersRes.data ?? [];
    setStats({
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total_nzd || 0), 0),
    });
    setLowStock(productsRes.data ?? []);
    setRecentOrders(recentRes.data ?? []);

    // B15: build chart from full 6-month dataset
    const allOrders = monthlyRes.data ?? [];
    const monthly: Record<string, number> = {};
    allOrders.forEach(o => {
      const month = new Date(o.created_at).toLocaleDateString('zh-CN', { month: 'short', year: '2-digit' });
      monthly[month] = (monthly[month] || 0) + Number(o.total_nzd || 0);
    });
    setMonthlyData(Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })));
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-green-200 text-green-900',
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">仪表盘</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-accent" />
            <div><p className="text-xs text-muted-foreground">今日订单</p><p className="text-xl font-bold">{stats.todayOrders}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-accent" />
            <div><p className="text-xs text-muted-foreground">今日销售额</p><p className="text-xl font-bold">NZ${stats.todayRevenue.toFixed(0)}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div><p className="text-xs text-muted-foreground">库存预警</p><p className="text-xl font-bold">{lowStock.length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <div><p className="text-xs text-muted-foreground">总订单</p><p className="text-xl font-bold">{recentOrders.length}+</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>销售趋势</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(43, 85%, 38%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader><CardTitle className="text-destructive">库存预警</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex justify-between items-center py-1 text-sm">
                  <span>{p.name_zh}</span>
                  <Badge variant="destructive">{p.stock_quantity} 件</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader><CardTitle>最新订单</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>日期</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.order_number}</TableCell>
                  <TableCell>{new Date(o.created_at).toLocaleDateString('zh-CN')}</TableCell>
                  <TableCell>{o.customer_name || o.customer_email}</TableCell>
                  <TableCell>NZ${Number(o.total_nzd || 0).toFixed(0)}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[o.status || 'pending']}>{o.status || 'pending'}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
