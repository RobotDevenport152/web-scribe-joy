import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { DollarSign, Weight, Calendar, Clock, Upload, MapPin, Phone, LogOut } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  raw: 'bg-muted text-muted-foreground',
  scoured: 'bg-blue-100 text-blue-800',
  combed: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-800',
};

const STATUS_LABELS: Record<string, string> = {
  raw: '原毛',
  scoured: '已洗涤',
  combed: '已精梳',
  ready: '可用',
};

const COLLECTION_POINTS = [
  { name: '基督城收集中心', address: '123 Riccarton Road, Christchurch', phone: '+64 3 123 4567', hours: '周一至周五 8:00-17:00', lat: -43.53, lng: 172.63 },
  { name: '奥克兰收集中心', address: '456 Queen Street, Auckland', phone: '+64 9 234 5678', hours: '周一至周五 9:00-17:00', lat: -36.85, lng: 174.76 },
  { name: '惠灵顿收集中心', address: '789 Lambton Quay, Wellington', phone: '+64 4 345 6789', hours: '周一至周四 8:30-16:30', lat: -41.29, lng: 174.78 },
  { name: '达尼丁收集中心', address: '321 George Street, Dunedin', phone: '+64 3 456 7890', hours: '周二至周五 9:00-16:00', lat: -45.87, lng: 170.50 },
  { name: '因弗卡吉尔收集中心', address: '654 Dee Street, Invercargill', phone: '+64 3 567 8901', hours: '周一至周三 8:00-15:00', lat: -46.41, lng: 168.35 },
];

const GrowerDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [grower, setGrower] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ description: '', alpaca_count: 0 });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    // Find grower by user email
    const { data: growerData } = await supabase
      .from('growers')
      .select('*')
      .eq('owner_name', user.email ?? '')
      .maybeSingle();

    if (growerData) {
      setGrower(growerData);
      setEditData({ description: growerData.description || '', alpaca_count: growerData.alpaca_count || 0 });

      const [batchRes, txRes] = await Promise.all([
        supabase.from('fiber_batches').select('*').eq('grower_id', growerData.id).order('harvest_date', { ascending: false }),
        supabase.from('grower_transactions').select('*').eq('grower_id', growerData.id).order('created_at', { ascending: false }),
      ]);
      setBatches(batchRes.data ?? []);
      setTransactions(txRes.data ?? []);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !grower) return;
    setUploading(true);
    const file = e.target.files[0];
    const path = `grower-${grower.id}/${Date.now()}-${file.name}`;
    const { error: uploadErr } = await supabase.storage.from('farm-images').upload(path, file);
    if (uploadErr) { toast.error('上传失败'); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('farm-images').getPublicUrl(path);
    await supabase.from('growers').update({ cover_image_url: publicUrl }).eq('id', grower.id);
    setGrower({ ...grower, cover_image_url: publicUrl });
    toast.success('照片已更新');
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!grower) return;
    const { error } = await supabase
      .from('growers')
      .update({ description: editData.description, alpaca_count: editData.alpaca_count })
      .eq('id', grower.id);
    if (error) { toast.error('更新失败'); return; }
    setGrower({ ...grower, ...editData });
    setEditMode(false);
    toast.success('信息已更新');
  };

  const yearFiber = batches
    .filter(b => new Date(b.harvest_date).getFullYear() === new Date().getFullYear())
    .reduce((sum, b) => sum + (b.weight_kg || 0), 0);

  const lastDelivery = batches[0]?.harvest_date;
  const yearsCooperation = grower?.created_at
    ? new Date().getFullYear() - new Date(grower.created_at).getFullYear()
    : 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-20 px-4 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!grower) {
    return (
      <div className="min-h-screen pt-20 px-4 text-center">
        <p className="text-muted-foreground mt-20">未找到关联的农场信息，请联系管理员。</p>
        <Button variant="outline" onClick={() => { signOut(); navigate('/login'); }} className="mt-4">退出登录</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-foreground">{grower.farm_name}</h1>
            <p className="text-sm text-muted-foreground">{grower.region}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate('/'); }}>
            <LogOut className="w-4 h-4 mr-1" /> 退出
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Credit 余额</p>
                <p className="text-lg font-semibold">NZ${Number(grower.credit_balance || 0).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Weight className="w-8 h-8 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">年度交付</p>
                <p className="text-lg font-semibold">{yearFiber.toFixed(1)} kg</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">最近交付</p>
                <p className="text-lg font-semibold">{lastDelivery ? new Date(lastDelivery).toLocaleDateString('zh-CN') : '—'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">合作年数</p>
                <p className="text-lg font-semibold">{yearsCooperation} 年</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fiber Batches */}
        <Card>
          <CardHeader><CardTitle className="text-lg">纤维批次记录</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>批次编号</TableHead>
                  <TableHead>收获日期</TableHead>
                  <TableHead>重量(kg)</TableHead>
                  <TableHead>微米数</TableHead>
                  <TableHead>等级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map(b => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs">{b.batch_code}</TableCell>
                    <TableCell>{new Date(b.harvest_date).toLocaleDateString('zh-CN')}</TableCell>
                    <TableCell>{b.weight_kg ?? '—'}</TableCell>
                    <TableCell>{b.micron_avg ? `${b.micron_avg}μm` : '—'}</TableCell>
                    <TableCell>{b.grade || '—'}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[b.processing_status || 'raw']}>
                        {STATUS_LABELS[b.processing_status || 'raw']}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedBatch(b)}>查看</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {batches.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">暂无批次记录</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Credit Transactions */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Credit 流水</CardTitle></CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">暂无交易记录</p>
            ) : (
              <div className="space-y-2">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm">{tx.description || tx.type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('zh-CN')}</p>
                    </div>
                    <span className={`font-semibold ${tx.amount_nzd >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {tx.amount_nzd >= 0 ? '+' : ''}NZ${Number(tx.amount_nzd).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-sm font-medium">可结算余额</span>
              <span className="text-lg font-bold text-accent">NZ${Number(grower.credit_balance || 0).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Collection Points */}
        <Card>
          <CardHeader><CardTitle className="text-lg">收集点</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {COLLECTION_POINTS.map(cp => (
                <div key={cp.name} className="border rounded-lg p-4 space-y-1">
                  <h4 className="font-semibold text-sm">{cp.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{cp.address}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{cp.phone}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{cp.hours}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farm Profile Edit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">农场信息</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? '取消' : '编辑'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cover image */}
            <div>
              {grower.cover_image_url && (
                <img src={grower.cover_image_url} alt={grower.farm_name} className="w-full h-48 object-cover rounded-lg mb-3" />
              )}
              <Label className="cursor-pointer inline-flex items-center gap-2 text-sm text-accent hover:underline">
                <Upload className="w-4 h-4" />
                {uploading ? '上传中...' : '更换农场照片'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </Label>
            </div>

            {editMode ? (
              <div className="space-y-3">
                <div>
                  <Label>农场简介</Label>
                  <Textarea value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} rows={4} />
                </div>
                <div>
                  <Label>羊驼数量</Label>
                  <Input type="number" value={editData.alpaca_count} onChange={e => setEditData(p => ({ ...p, alpaca_count: parseInt(e.target.value) || 0 }))} />
                </div>
                <Button onClick={handleSaveProfile}>保存</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm">{grower.description || '暂无简介'}</p>
                <p className="text-sm text-muted-foreground">羊驼数量：{grower.alpaca_count || 0} 头</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Batch Detail Dialog */}
      <Dialog open={!!selectedBatch} onOpenChange={() => setSelectedBatch(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>批次详情</DialogTitle></DialogHeader>
          {selectedBatch && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">批次编号：</span>{selectedBatch.batch_code}</div>
                <div><span className="text-muted-foreground">收获日期：</span>{new Date(selectedBatch.harvest_date).toLocaleDateString('zh-CN')}</div>
                <div><span className="text-muted-foreground">重量：</span>{selectedBatch.weight_kg ?? '—'} kg</div>
                <div><span className="text-muted-foreground">微米数：</span>{selectedBatch.micron_avg ?? '—'} μm</div>
                <div><span className="text-muted-foreground">等级：</span>{selectedBatch.grade || '—'}</div>
                <div><span className="text-muted-foreground">地区：</span>{selectedBatch.region || '—'}</div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">状态：</span>
                <Badge className={`ml-2 ${STATUS_COLORS[selectedBatch.processing_status || 'raw']}`}>
                  {STATUS_LABELS[selectedBatch.processing_status || 'raw']}
                </Badge>
              </div>
              {selectedBatch.notes && <p className="text-sm border-t pt-3">{selectedBatch.notes}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GrowerDashboard;
