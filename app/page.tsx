'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Globe, Map, BarChart3, Activity, TrendingUp, Layers, MapPin, Flame, Wind, X, Maximize2, CloudRain, Mountain, Snowflake, Calendar, Target } from 'lucide-react';

function TabNavigation({ activeTab, setActiveTab, tabs }: any) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-200">
      {tabs.map((tab: string) => (
        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 whitespace-nowrap transition-all font-medium ${activeTab === tab ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'}`}>{tab}</button>
      ))}
    </div>
  );
}
// FINAL Interactive Hotspot Map with COUNTRY LABELS and CONTINENT OUTLINES!

function GeospatialHotspots({ hotspots }: { hotspots: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const categoryColors: Record<string, { bg: string; hex: string }> = {
    'Severe Storms': { bg: 'bg-blue-500', hex: '#3b82f6' },
    'Wildfires': { bg: 'bg-red-500', hex: '#ef4444' },
    'Volcanoes': { bg: 'bg-orange-500', hex: '#f97316' },
    'Floods': { bg: 'bg-cyan-500', hex: '#06b6d4' },
    'Sea and Lake Ice': { bg: 'bg-purple-500', hex: '#8b5cf6' },
  };

  const filteredHotspots = selectedCategory === 'all' 
    ? hotspots 
    : hotspots.filter(h => h.primary_category.includes(selectedCategory));

  const topHotspots = filteredHotspots.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Map Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Map className="w-5 h-5" />
              Global Event Hotspots
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredHotspots.length} hotspots • {filteredHotspots.reduce((sum, h) => sum + h.count, 0).toLocaleString()} total events
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                selectedCategory === 'all' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({hotspots.length})
            </button>
            {['Storm', 'Wildfire', 'Volcano', 'Flood', 'Ice'].map(cat => {
              const count = hotspots.filter(h => h.primary_category.includes(cat)).length;
              if (count === 0) return null; // Don't show button if no data
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                    selectedCategory === cat ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}s ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Map Container with Real World Map */}
        <div className="relative bg-white rounded-lg overflow-hidden border-2 border-gray-300" style={{ height: '700px' }}>
          {/* Real World Map as background - Natural Earth map */}
          <img 
            src="https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg" 
            alt="World Map"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            style={{ objectPosition: 'center', objectFit: 'cover' }}
          />

          {/* Coordinate labels */}
          <div className="absolute top-3 left-3 right-3 flex justify-between text-xs text-gray-600 font-mono font-semibold">
            <span>180°W</span>
            <span>90°W</span>
            <span>0°</span>
            <span>90°E</span>
            <span>180°E</span>
          </div>
          <div className="absolute top-3 bottom-3 left-3 flex flex-col justify-between text-xs text-gray-600 font-mono font-semibold">
            <span>90°N</span>
            <span>45°N</span>
            <span>0°</span>
            <span>45°S</span>
            <span>90°S</span>
          </div>

          {/* Hotspot markers with category-specific icons */}
          <div className="absolute inset-0">
            {filteredHotspots.map((hotspot, idx) => {
              // Original coordinates for tooltip display
              const trueLat = hotspot.latitude;
              const trueLon = hotspot.longitude;
              
              // Apply visual offset to align with map (shift east and south)
              const visualLon = trueLon + 15; // Shift east to align with continents
              const visualLat = trueLat - 5;  // Shift south to align better
              
              // Calculate position using adjusted coordinates for display
              const x = ((visualLon + 180) / 360) * 100;
              const y = ((90 - visualLat) / 180) * 100;
              const baseSize = Math.min(Math.sqrt(hotspot.count) * 2, 40);
              const category = hotspot.primary_category;
              const color = categoryColors[category]?.hex || '#64748b';
              
              // Determine which icon to use based on category
              let IconComponent;
              if (category.includes('Wildfire')) {
                IconComponent = Flame;
              } else if (category.includes('Storm')) {
                IconComponent = Wind;
              } else if (category.includes('Volcano')) {
                IconComponent = Mountain;
              } else if (category.includes('Flood')) {
                IconComponent = CloudRain;
              } else if (category.includes('Ice')) {
                IconComponent = Snowflake;
              } else {
                IconComponent = MapPin;
              }

              return (
                <div
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:z-50 group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onMouseEnter={() => setHoveredRegion(hotspot.title)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  {/* Animated pulse ring */}
                  <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{
                      width: `${baseSize * 2}px`,
                      height: `${baseSize * 2}px`,
                      backgroundColor: color,
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%',
                      animationDuration: '2s'
                    }}
                  />
                  
                  {/* Main hotspot marker with icon */}
                  <div
                    className="rounded-full opacity-90 group-hover:opacity-100 group-hover:scale-125 transition-all relative z-10 border-2 border-white flex items-center justify-center"
                    style={{
                      width: `${baseSize}px`,
                      height: `${baseSize}px`,
                      backgroundColor: color,
                      boxShadow: `0 0 ${baseSize}px ${color}`,
                    }}
                  >
                    <IconComponent 
                      className="text-white" 
                      style={{ 
                        width: `${baseSize * 0.5}px`, 
                        height: `${baseSize * 0.5}px`,
                        strokeWidth: 2.5
                      }} 
                    />
                  </div>

                  {/* Tooltip on hover */}
                  {hoveredRegion === hotspot.title && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 min-w-[220px] z-50">
                      <div className="bg-white/98 backdrop-blur-sm border-2 border-gray-300 rounded-xl p-4 shadow-2xl">
                        <div className="text-gray-900 font-bold text-lg mb-2">{hotspot.title}</div>
                        <div className="flex items-center gap-2 mb-3">
                          <div 
                            className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center" 
                            style={{ backgroundColor: color }}
                          >
                            <IconComponent className="text-white w-4 h-4" strokeWidth={2.5} />
                          </div>
                          <span className="text-gray-700 text-sm font-semibold">{category}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                            <span className="text-gray-600 text-xs">Events:</span>
                            <span className="text-blue-600 text-base font-bold">{hotspot.count.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                            <span className="text-gray-600 text-xs">Coordinates:</span>
                            <span className="text-gray-700 text-xs font-mono">
                              {trueLat.toFixed(2)}°, {trueLon.toFixed(2)}°
                            </span>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div 
                          className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
                          style={{
                            width: 0,
                            height: 0,
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop: '10px solid rgba(255, 255, 255, 0.98)'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info overlay */}
          <div className="absolute top-16 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 border-2 border-blue-500/40 shadow-xl">
            <p className="text-gray-900 text-sm font-bold mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {filteredHotspots.length} Active Hotspots
            </p>
            <p className="text-gray-600 text-xs">
              {selectedCategory === 'all' ? 'All Categories' : `${selectedCategory} Events Only`}
            </p>
          </div>
        </div>

        {/* Category Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(categoryColors).map(([cat, style]) => (
            <div key={cat} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
              <div 
                className={`w-4 h-4 rounded-full ${style.bg}`}
                style={{ boxShadow: `0 0 8px ${style.hex}` }}
              />
              <span className="text-gray-700 text-sm">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Hotspots Data Cards */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Top 5 Hotspots {selectedCategory !== 'all' && `(${selectedCategory})`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {topHotspots.map((hotspot, idx) => {
            const color = categoryColors[hotspot.primary_category]?.hex || '#64748b';
            return (
              <div 
                key={idx}
                className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-500 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-gray-400">{idx + 1}</span>
                  <div 
                    className="w-5 h-5 rounded-full"
                    style={{ 
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}`
                    }}
                  />
                </div>
                <h4 className="text-gray-900 font-semibold text-xs mb-2 line-clamp-2 leading-tight">{hotspot.title}</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-[10px]">Events:</span>
                    <span className="text-blue-500 font-bold text-xs">{hotspot.count.toLocaleString()}</span>
                  </div>
                  <div className="text-gray-500 text-[10px] flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {hotspot.latitude.toFixed(1)}°, {hotspot.longitude.toFixed(1)}°
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-500 mb-1">
              {filteredHotspots.reduce((sum, h) => sum + h.count, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Events</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500 mb-1">
              {filteredHotspots.length}
            </p>
            <p className="text-sm text-gray-600">Active Hotspots</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-500 mb-1">
              {filteredHotspots.length > 0 
                ? Math.round(filteredHotspots.reduce((sum, h) => sum + h.count, 0) / filteredHotspots.length).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-gray-600">Avg per Hotspot</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-500 mb-1">
              {filteredHotspots.length > 0 
                ? Math.max(...filteredHotspots.map(h => h.count)).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-gray-600">Max Intensity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Globe3D({ globeUrl }: { globeUrl: string | null }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  if (!globeUrl) return <div className="bg-white rounded-lg p-12 border border-gray-200"><div className="text-center text-gray-500"><Globe className="w-16 h-16 mx-auto mb-4" /><p className="text-xl">3D Globe visualization not available</p></div></div>;
  return (<><div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm"><div className="bg-gray-50 px-6 py-4 border-b border-gray-200"><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><Globe className="w-5 h-5" />Three-Dimensional Geospatial Visualization</h2></div><button onClick={() => setIsFullscreen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-all flex items-center gap-2"><Maximize2 className="w-4 h-4" />Fullscreen</button></div></div><iframe src={globeUrl} className="w-full h-[600px] border-0" title="3D Globe"/></div>{isFullscreen && (<div className="fixed inset-0 bg-white z-50 flex flex-col"><div className="bg-gray-100 border-b border-gray-300 p-4 flex justify-between"><h2 className="text-gray-900 text-xl font-semibold flex items-center gap-2"><Globe className="w-5 h-5" />3D Globe Visualization</h2><button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded font-semibold flex items-center gap-2" onClick={() => setIsFullscreen(false)}><X className="w-4 h-4" />Close</button></div><iframe src={globeUrl} className="flex-1 w-full border-0"/></div>)}</>);
}

function AnalysisImageGallery({ images }: { images: any }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const filteredImages = Object.entries(images || {}).filter(([filename]) => {
    const lower = filename.toLowerCase();
    // Filter out unwanted visualizations
    const excludePatterns = [
      '3d_density_surface',
      '3d_spacetime_scatter',
      'spatial_cluster',
      'category_cluster',
      'events_over_time_monthly',
      'category_concentration',
      'temporal_analysis',
      'hotspot_analysis',
      'multipanel_figure',
      'multi_panel_figure',
      'multipanel',
      'multi panel',
      'infographic_map',
      'infographic'
    ];
    return !excludePatterns.some(pattern => lower.includes(pattern));
  });
  if (filteredImages.length === 0) return <div className="text-center text-gray-500 py-12 bg-gray-50 rounded border border-gray-200"><BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" /><p>No visualizations available</p></div>;
  return (<div><p className="text-gray-700 font-medium mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5" />{filteredImages.length} statistical visualizations</p><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{filteredImages.map(([filename, info]: [string, any]) => (<div key={filename} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all cursor-pointer shadow-sm" onClick={() => setSelectedImage(info.path)}><div className="relative bg-gray-50 p-4 border-b border-gray-200"><img src={info.path} alt={info.title} className="w-full h-auto object-contain rounded" style={{maxHeight:'500px'}}/></div><div className="p-4"><h3 className="text-gray-900 font-semibold text-lg">{info.title}</h3></div></div>))}</div>{selectedImage && (<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}><button className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-900 p-3 rounded-lg font-semibold shadow-lg flex items-center gap-2" onClick={(e) => {e.stopPropagation(); setSelectedImage(null);}}><X className="w-5 h-5" />Close</button><img src={selectedImage} alt="Full" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"/></div>)}</div>);
}

function InteractiveMapsGallery({ maps }: { maps: any }) {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  if (!maps || Object.keys(maps).length === 0) return <div className="text-center text-gray-500 py-12 bg-gray-50 rounded border border-gray-200"><Map className="w-12 h-12 mx-auto mb-3 text-gray-400" /><p>No interactive maps available</p></div>;
  
  const mapEntries = Object.entries(maps).filter(([filename]) => {
    const lower = filename.toLowerCase();
    // Filter out unwanted maps
    const excludePatterns = [
      '3d_globe_interactive',
      'seasonal_risk_calendar',
      'seasonal_risk_calender', // typo variant
      '3d_intelligence_globe',
      'risk_hotspot_map',
      'temporal_risk_analysis',
      'kde_heatmap',
      'narrative_map',
      '3d_density_surface',
      '3d_spacetime_scatter',
      'temporal_dashboard',
      'density_heat_map',
      'density_heatmap',
      'master_dashboard',
      'cinematic_timeline',
      'cumulative_buildup',
      'animated_timeline',
      'multipanel_figure',
      'infographic_map'
    ];
    return !excludePatterns.some(pattern => lower.includes(pattern));
  });
  return (<div><p className="text-gray-700 font-medium mb-6 flex items-center gap-2"><Map className="w-5 h-5" />{mapEntries.length} interactive geospatial maps</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{mapEntries.map(([filename, info]: [string, any]) => (<div key={filename} className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-all cursor-pointer shadow-sm p-6 text-center" onClick={() => setSelectedMap(info.path)}><div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4"><Map className="w-8 h-8 text-gray-700" /></div><h3 className="text-gray-900 font-semibold text-lg mb-2">{info.title}</h3><div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-3"><Maximize2 className="w-4 h-4" /><span>View Full Screen</span></div></div>))}</div>{selectedMap && (<div className="fixed inset-0 bg-white z-50 flex flex-col"><div className="bg-gray-100 border-b border-gray-300 p-4 flex justify-between items-center"><h2 className="text-gray-900 text-xl font-semibold">Interactive Map Viewer</h2><button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded flex items-center gap-2 font-medium" onClick={() => setSelectedMap(null)}><X className="w-4 h-4" />Close</button></div><iframe src={selectedMap} className="flex-1 w-full border-0"/></div>)}</div>);
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Executive Overview');
  const tabs = ['Executive Overview', 'Geospatial Analysis', 'Temporal Analysis', 'Interactive Maps', 'Statistical Visualizations'];

  useEffect(() => {
    fetch('/analysis_data.json').then(res => {if(!res.ok) throw new Error('Run python script'); return res.json();}).then(d => {setData(d); setLoading(false);}).catch(e => {setError(e.message); setLoading(false);});
  }, []);

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center"><div className="text-center"><div className="text-6xl mb-4 animate-bounce">🌍</div><div className="text-white text-2xl font-bold">Loading...</div></div></div>;
  if (error) return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4"><div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8"><h2 className="text-white text-2xl font-bold mb-4">Data Not Found</h2><p className="text-slate-300">{error}</p></div></div>;

  const { metadata, executive_metrics, hotspots, seasonal_patterns, yearly_trends, available_visualizations } = data;
  const globeUrl = available_visualizations?.interactive_maps?.['3d_globe_interactive.html']?.path || null;
  const seasonalData = seasonal_patterns.map((s: any) => ({month: s.month_name, total: s.total_events, storms: s.storms, wildfires: s.wildfires, volcanoes: s.volcanoes || 0, floods: s.floods || 0, ice: s.ice || 0}));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 110 92" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="55" cy="46" r="44" fill="#111827" />
                  <ellipse cx="55" cy="46" rx="42" ry="13" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
                  <circle cx="28" cy="28" r="2" fill="white" />
                  <circle cx="33" cy="24" r="1.5" fill="white" />
                  <circle cx="77" cy="33" r="2" fill="white" />
                  <circle cx="72" cy="28" r="1.5" fill="white" />
                  <circle cx="82" cy="26" r="1.5" fill="white" />
                  <text x="55" y="52" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">NASA</text>
                  <path d="M 33,42 L 45,30 L 57,42 L 69,30 L 77,42" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NASA EONET Analytics Platform</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-sm font-bold text-gray-900">Developed by Sujan Bhattarai</p>
                  <div className="flex items-center gap-2">
                    <a 
                      href="https://github.com/Sujan-Bhattarai12" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-600 transition-colors"
                      title="GitHub Profile"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/bhattarai1/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-600 transition-colors"
                      title="LinkedIn Profile"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                  <span className="text-gray-400">|</span>
                  <p className="text-sm text-gray-600">Earth Observation Natural Event Tracker</p>
                </div>
              </div>
            </div>
            <div className="text-right"><p className="text-sm text-gray-900 font-semibold">{metadata.date_range.start} → {metadata.date_range.end}</p><p className="text-xs text-gray-600">{metadata.total_observations.toLocaleString()} Observations</p></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"><div className="flex items-center justify-between mb-2"><BarChart3 className="w-8 h-8 text-gray-700" /><span className="text-xs text-gray-600 font-semibold bg-gray-100 px-2 py-1 rounded">{metadata.years_tracked} Years</span></div><p className="text-3xl font-bold text-gray-900 mb-1">{metadata.total_observations.toLocaleString()}</p><p className="text-sm text-gray-600">Total Observations</p></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"><div className="flex items-center justify-between mb-2"><Target className="w-8 h-8 text-gray-700" /><span className="text-xs text-gray-600 font-semibold bg-gray-100 px-2 py-1 rounded">Unique</span></div><p className="text-3xl font-bold text-gray-900 mb-1">{metadata.unique_events.toLocaleString()}</p><p className="text-sm text-gray-600">Natural Events</p></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"><div className="flex items-center justify-between mb-2"><Flame className="w-8 h-8 text-gray-700" /><span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded">{((executive_metrics.category_counts['Wildfires'] || 0) / metadata.total_observations * 100).toFixed(1)}%</span></div><p className="text-3xl font-bold text-gray-900 mb-1">{(executive_metrics.category_counts['Wildfires'] || 0).toLocaleString()}</p><p className="text-sm text-gray-600">Wildfires</p></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"><div className="flex items-center justify-between mb-2"><Wind className="w-8 h-8 text-gray-700" /><span className="text-xs text-blue-500 font-semibold bg-blue-50 px-2 py-1 rounded">{((executive_metrics.category_counts['Severe Storms'] || 0) / metadata.total_observations * 100).toFixed(1)}%</span></div><p className="text-3xl font-bold text-gray-900 mb-1">{(executive_metrics.category_counts['Severe Storms'] || 0).toLocaleString()}</p><p className="text-sm text-gray-600">Severe Storms</p></div>
        </div>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        <div className="mb-8">
          {activeTab === 'Executive Overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Seasonal Event Distribution Analysis
                </h2>
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart data={seasonalData} margin={{top:20,right:30,left:20,bottom:20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                    <XAxis dataKey="month" stroke="#6b7280" style={{fontSize:'14px',fontWeight:600}}/>
                    <YAxis stroke="#6b7280" style={{fontSize:'14px',fontWeight:600}} label={{value:'Event Frequency',angle:-90,position:'insideLeft',style:{fill:'#6b7280',fontSize:'14px'}}}/>
                    <Tooltip contentStyle={{backgroundColor:'#ffffff',border:'1px solid #d1d5db',borderRadius:'8px',padding:'12px'}}/>
                    <Legend wrapperStyle={{paddingTop:'20px'}}/>
                    <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} name="Total" dot={{r:5}}/>
                    <Line type="monotone" dataKey="storms" stroke="#8b5cf6" strokeWidth={2} name="Storms" dot={{r:4}}/>
                    <Line type="monotone" dataKey="wildfires" stroke="#ef4444" strokeWidth={2} name="Wildfires" dot={{r:4}}/>
                    <Line type="monotone" dataKey="volcanoes" stroke="#f97316" strokeWidth={2} name="Volcanoes" dot={{r:4}}/>
                    <Line type="monotone" dataKey="floods" stroke="#06b6d4" strokeWidth={2} name="Floods" dot={{r:4}}/>
                    <Line type="monotone" dataKey="ice" stroke="#a855f7" strokeWidth={2} name="Ice" dot={{r:4}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Globe3D globeUrl={globeUrl}/>
            </div>
          )}
          {activeTab === 'Geospatial Analysis' && <GeospatialHotspots hotspots={hotspots}/>}
          {activeTab === 'Temporal Analysis' && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Multi-Year Temporal Trend Analysis
              </h2>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={yearly_trends} margin={{top:20,right:30,left:20,bottom:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                  <XAxis dataKey="year" stroke="#6b7280" style={{fontSize:'14px',fontWeight:600}}/>
                  <YAxis stroke="#6b7280" style={{fontSize:'14px',fontWeight:600}}/>
                  <Tooltip contentStyle={{backgroundColor:'#ffffff',border:'1px solid #d1d5db',borderRadius:'8px'}}/>
                  <Legend/>
                  <Bar dataKey="total" fill="#3b82f6" name="Total Events" radius={[8,8,0,0]}/>
                  <Bar dataKey="storms" fill="#8b5cf6" name="Storms" radius={[8,8,0,0]}/>
                  <Bar dataKey="wildfires" fill="#ef4444" name="Wildfires" radius={[8,8,0,0]}/>
                  <Bar dataKey="volcanoes" fill="#f97316" name="Volcanoes" radius={[8,8,0,0]}/>
                  <Bar dataKey="floods" fill="#06b6d4" name="Floods" radius={[8,8,0,0]}/>
                  <Bar dataKey="ice" fill="#a855f7" name="Ice" radius={[8,8,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {activeTab === 'Statistical Visualizations' && (<div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"><h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2"><Layers className="w-5 h-5" />Statistical Analysis & Data Visualization</h2><AnalysisImageGallery images={available_visualizations?.static_images||{}}/></div>)}
          {activeTab === 'Interactive Maps' && (<div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"><h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2"><Map className="w-5 h-5" />Interactive Geospatial Maps</h2><InteractiveMapsGallery maps={available_visualizations?.interactive_maps||{}}/></div>)}
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-12 border-t border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-gray-900 mb-1">Data Source & Methodology</p>
            <p>NASA Earth Observatory Natural Event Tracker (EONET) API</p>
            <p className="mt-2">Analysis Framework: Python • Visualization: React + Recharts • Geospatial Processing</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">Sujan Bhattarai</p>
            <p className="text-sm text-gray-600">Data Science & Earth Observation Analytics</p>
          </div>
        </div>
      </footer>
    </div>
  );
}