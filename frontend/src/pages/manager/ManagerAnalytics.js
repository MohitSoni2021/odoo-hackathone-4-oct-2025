import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  BoltIcon,
  PresentationChartBarIcon,
  ScaleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ManagerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expenses/manager-analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (type) => {
    let csvContent = '';
    if (type === 'monthly') {
      csvContent = 'Month,Year,Total Amount,Count\n';
      analytics.monthlyTrends.forEach(item => {
        csvContent += `${item._id.month},${item._id.year},${item.totalAmount},${item.count}\n`;
      });
    } else if (type === 'category') {
      csvContent = 'Category,Total Amount,Count\n';
      analytics.categoryBreakdown.forEach(item => {
        csvContent += `${item._id},${item.totalAmount},${item.count}\n`;
      });
    } else if (type === 'employee') {
      csvContent = 'Employee,Email,Total Amount,Count\n';
      analytics.topEmployees.forEach(item => {
        csvContent += `${item._id.firstName} ${item._id.lastName},${item._id.email},${item.totalAmount},${item.count}\n`;
      });
    }
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse font-inter">
        <div className="w-20 h-20 border-4 border-slate-200 border-t-accent rounded-full animate-spin mb-8 shadow-massive"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Calculating Strategic Impact Matrix...</p>
      </div>
    );
  }

  if (!analytics) return null;

  const CHART_COLORS = ['#1E293B', '#FF6B3D', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444'];

  const monthlyData = analytics.monthlyTrends.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    amount: item.totalAmount,
    count: item.count
  }));

  const categoryData = analytics.categoryBreakdown.map(item => ({
    name: item._id,
    value: item.totalAmount
  }));

  const employeeData = analytics.topEmployees.slice(0, 10).map(item => ({
    name: `${item._id.firstName} ${item._id.lastName}`,
    amount: item.totalAmount,
    count: item.count
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 font-inter space-y-12">
      
      {/* Premium Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shadow-massive transform hover:rotate-6 transition-transform">
            <PresentationChartBarIcon className="h-10 w-10 text-accent" />
          </div>

          <div>
            <h1 className="text-h-xl font-black text-text-primary tracking-tighter italic uppercase">Divisional Intelligence</h1>
            <p className="text-body text-text-muted font-medium opacity-70">
              Corporate performance metrics and capital distribution analysis.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => downloadReport('monthly')}
            className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-accent transition-all shadow-massive group"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-3 text-accent group-hover:text-white transition-colors" />
            Audit Protocol Export
          </button>

        </div>
      </div>

      {/* Strategic Overview Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Current Velocity', value: `$${analytics.teamOverview.currentMonth.total.toLocaleString()}`, sub: `${analytics.teamOverview.currentMonth.count} Submissions`, icon: BoltIcon, color: 'primary' },
          { label: 'Impact Variance', value: `${Math.abs(analytics.teamOverview.percentageChange)}%`, sub: 'vs previous audit cycle', icon: analytics.teamOverview.percentageChange >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon, color: analytics.teamOverview.percentageChange >= 0 ? 'error' : 'success', trend: true },
          { label: 'Personnel Scope', value: analytics.totalStats.teamSize, sub: 'Active Division Nodes', icon: UsersIcon, color: 'info' },
          { label: 'Avg Validation', value: `${analytics.approvalQueue.avgApprovalTimeHours}h`, sub: 'Optimization target: 12h', icon: ShieldCheckIcon, color: 'accent', dark: true },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.dark ? 'bg-slate-900 text-white border-white/5 shadow-massive' : 'bg-surface text-text-primary border-border shadow-premium'} p-8 rounded-xl border group hover:shadow-massive transition-all relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none ${stat.dark ? 'text-white' : 'text-slate-900'}`}>
              <stat.icon className="h-20 w-20" />
            </div>

            <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60 italic ${stat.dark ? 'text-accent' : 'text-text-muted'}`}>{stat.label}</div>
            <div className={`text-4xl font-black tracking-tighter italic flex items-center gap-2 ${stat.trend ? (analytics.teamOverview.percentageChange >= 0 ? 'text-error' : 'text-success') : ''}`}>
              {stat.trend && <stat.icon className="h-8 w-8 stroke-[3]" />}
              {stat.value}
            </div>
            <div className={`mt-5 text-[10px] font-black uppercase tracking-widest italic opacity-60 ${stat.dark ? 'text-slate-400' : 'text-text-muted'}`}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Analytical Data Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Trend Analysis Frame */}
        <div className="lg:col-span-8 bg-surface rounded-[2.5rem] border border-border shadow-massive p-10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter italic">Capital Outlay Dynamics</h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1 opacity-60">Trailing 12-Month Expenditure Sequence</p>
            </div>
            <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-massive"></div>

              <span className="text-[10px] font-black text-text-primary uppercase tracking-widest italic">Global Vault Value</span>
            </div>
          </div>
          <div className="h-[450px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E293B" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1E293B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 10, fontWeight: 900, textTransform: 'uppercase'}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 10, fontWeight: 900}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1E293B', borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', padding: '20px'}}
                  itemStyle={{fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF'}}
                  labelStyle={{fontSize: '10px', fontWeight: 900, color: '#FF6B3D', marginBottom: '8px', letterSpacing: '0.1em', textTransform: 'uppercase'}}
                  cursor={{ stroke: '#FF6B3D', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#1E293B" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  name="CAPITAL FLOW"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Allocation Frame */}
        <div className="lg:col-span-4 bg-surface rounded-xl border border-border shadow-massive p-10 flex flex-col group">
          <div className="mb-12">
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter italic">Domain Distribution</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1 opacity-60">Capital Allocation by Sector</p>
          </div>

          
          <div className="h-[280px] relative mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" className="hover:opacity-80 transition-opacity cursor-pointer shadow-massive" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{backgroundColor: '#1E293B', borderRadius: '16px', border: 'none', color: '#FFF'}}
                   itemStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-[8px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Global Share</div>
                <div className="text-3xl font-black text-text-primary uppercase tracking-tighter italic">100%</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {categoryData.slice(0, 5).map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-transparent hover:border-border group/cat transition-all duration-300">

                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                  <span className="text-[11px] font-black text-text-primary uppercase tracking-tight truncate max-w-[140px] italic">{category.name}</span>
                </div>
                <span className="text-sm font-black text-text-primary tracking-tighter italic">${category.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Personnel Expenditure Framework */}
      <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden group">

        <div className="p-10 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <div className="p-4 bg-accent/10 rounded-xl text-accent">
               <ScaleIcon className="h-6 w-6" />
             </div>

             <div>
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter italic">Operative Expenditure Index</h3>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-1 opacity-60">Top 10 High-Impact Asset Controllers</p>
            </div>
          </div>
          <button
             onClick={() => downloadReport('employee')}
             className="w-14 h-14 bg-slate-900 rounded-xl text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center shadow-massive group/dl"
          >

            <ArrowDownTrayIcon className="h-6 w-6 group-hover/dl:scale-110 transition-transform" />
          </button>
        </div>
        <div className="p-10">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeData} layout="vertical" margin={{ left: 20, right: 40, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#0F172A', fontSize: 11, fontWeight: 900, textTransform: 'uppercase'}} 
                  width={180}
                />
                <Tooltip 
                   cursor={{fill: '#F8FAFC', opacity: 0.5}}
                   contentStyle={{backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#FFF'}}
                   itemStyle={{fontSize: '11px', fontWeight: 900, textTransform: 'uppercase'}}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#FF6B3D" 
                  radius={[0, 16, 16, 0]} 
                  barSize={32}
                  name="LIABILITY EXPOSURE ($)"
                  animationDuration={2000}
                >
                   {employeeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#1E293B' : '#FF6B3D'} className="hover:opacity-80 transition-opacity cursor-pointer shadow-massive" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Executive Impact Synthesis */}
      <div className="bg-slate-900 rounded-xl p-12 text-white relative overflow-hidden shadow-massive group">

        <div className="absolute top-0 right-0 w-full h-full bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 p-20 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000">
          <ShieldCheckIcon className="h-96 w-96" />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-left">
          <div className="space-y-5">
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] italic opacity-80 flex items-center justify-center md:justify-start gap-3">
              <CurrencyDollarIcon className="h-4 w-4" />
              Aggregate Liquidity
            </h4>
            <div className="text-6xl font-black italic tracking-tighter uppercase">
               ${analytics.totalStats.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs font-bold text-slate-400 italic leading-relaxed max-w-[240px] mx-auto md:mx-0 opacity-60 uppercase tracking-widest">Global divisional outlay across all secure archives.</p>
          </div>
          <div className="space-y-5 border-white/10 md:border-x md:px-16">
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] italic opacity-80 flex items-center justify-center md:justify-start gap-3">
              <DocumentTextIcon className="h-4 w-4" />
              Artifact volume
            </h4>
            <div className="text-6xl font-black italic tracking-tighter uppercase">
               {analytics.totalStats.totalCount}
            </div>
            <p className="text-xs font-bold text-slate-400 italic leading-relaxed max-w-[240px] mx-auto md:mx-0 opacity-60 uppercase tracking-widest">Total validated data artifacts in corporate vault.</p>
          </div>
          <div className="space-y-5">
            <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.4em] italic opacity-80 flex items-center justify-center md:justify-start gap-3">
              <UsersIcon className="h-4 w-4" />
              Unit density
            </h4>
            <div className="text-6xl font-black italic tracking-tighter uppercase">
               {analytics.totalStats.teamSize}
            </div>
            <p className="text-xs font-bold text-slate-400 italic leading-relaxed max-w-[240px] mx-auto md:mx-0 opacity-60 uppercase tracking-widest">Unique personnel profiles with active submission nodes.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManagerAnalytics;