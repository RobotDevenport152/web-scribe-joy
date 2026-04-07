import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Package, ShoppingCart, Users, Layers, Tag, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV = [
  { title: '仪表盘', url: '/admin', icon: LayoutDashboard },
  { title: '产品管理', url: '/admin/products', icon: Package },
  { title: '订单管理', url: '/admin/orders', icon: ShoppingCart },
  { title: '养殖户管理', url: '/admin/growers', icon: Users },
  { title: '纤维批次', url: '/admin/fiber-batches', icon: Layers },
  { title: '促销码', url: '/admin/promos', icon: Tag },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full pt-16">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>管理后台</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.map(item => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <Link to={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="p-4 border-t border-border">
            <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start gap-2">
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </Button>
          </div>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <SidebarTrigger className="mb-4" />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
