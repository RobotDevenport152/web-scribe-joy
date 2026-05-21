"""
order_insights.py

Simple Supabase analytics script:
- Connects to Supabase using environment variables SUPABASE_URL and SUPABASE_SERVICE_KEY
- Fetches orders and order_items
- Computes conversion rate (orders / unique visitors placeholder), avg order value, category breakdown
- Writes CSV output and a matplotlib plot (avg order value over time)

Usage:
$ python analytics/order_insights.py

"""
import os
import sys
from datetime import datetime
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import requests

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
if not SUPABASE_URL or not SUPABASE_KEY:
    print('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in environment')
    sys.exit(1)

def supabase_get(table: str, select: str = '*'):
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    r = requests.get(url, headers=headers)
    r.raise_for_status()
    return r.json()


def main():
    # Fetch orders and order_items
    print('Fetching orders...')
    orders = pd.DataFrame(supabase_get('orders'))
    print(f'Orders fetched: {len(orders)}')
    items = pd.DataFrame(supabase_get('order_items'))
    print(f'Order items fetched: {len(items)}')

    if orders.empty:
        print('No orders found, exiting')
        return

    # Parse dates
    orders['created_at'] = pd.to_datetime(orders['created_at'])

    # Basic KPIs
    total_orders = len(orders)
    total_revenue = orders['total'].sum()
    avg_order_value = orders['total'].mean()

    print(f'Total orders: {total_orders}')
    print(f'Total revenue: {total_revenue:.2f}')
    print(f'Average order value: {avg_order_value:.2f}')

    # Orders over time (daily)
    daily = orders.set_index('created_at').resample('D').agg({'id': 'count', 'total':'sum'}).rename(columns={'id':'orders'})
    daily.to_csv('analytics/daily_orders.csv')

    # Category breakdown from order_items (requires product info)
    if not items.empty and 'product_id' in items.columns:
        prod_counts = items.groupby('product_id')['quantity'].sum().reset_index().rename(columns={'quantity':'units_sold'})
        prod_counts.to_csv('analytics/product_counts.csv', index=False)

    # Save KPIs
    kpis = pd.DataFrame([{
        'date': datetime.utcnow().isoformat(),
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'avg_order_value': avg_order_value
    }])
    kpis.to_csv('analytics/kpis.csv', index=False)

    # Plot avg order value over time
    plt.figure(figsize=(8,4))
    daily['avg'] = daily['total'] / daily['orders']
    daily['avg'].fillna(0, inplace=True)
    daily['avg'].plot(title='Daily Average Order Value')
    plt.ylabel('Average Order Value')
    plt.tight_layout()
    plt.savefig('analytics/avg_order_value.png')
    print('Analytics saved to analytics/*.csv and analytics/avg_order_value.png')

if __name__ == '__main__':
    main()
