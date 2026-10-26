import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, MapPin, Activity, CheckCircle2, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function GroundStationsList() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getGroundStations();
        setStations(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Ground Segment Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Global Ground Tracking Stations
          </h1>
        </div>

        <Link
          to="/app/communication-passes"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#111C2E] border border-[#263449] hover:border-[#38BDF8] text-[#38BDF8] font-mono text-xs uppercase"
        >
          <Calendar className="w-4 h-4" />
          <span>View Pass Calendar</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
          Querying ground station telemetry and dish tracking schedules...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((gs) => (
            <div key={gs.id} className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                      Code: {gs.code}
                    </span>
                    <h3 className="text-lg font-display font-bold text-white mt-0.5">{gs.name}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    gs.status === 'online' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[#FBBF24]/20 text-[#FBBF24]'
                  }`}>
                    {gs.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
                  <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>{gs.location}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070B14]/70 border border-[#263449] text-xs font-mono space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Frequency Bands:</span>
                    <span className="text-[#38BDF8]">{gs.frequencyBands?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Dish Antennas:</span>
                    <span>{gs.antennasCount} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Coordinates:</span>
                    <span>{gs.coordinates?.lat?.toFixed(2)}°, {gs.coordinates?.lon?.toFixed(2)}°</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#263449]/60 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>Operator: {gs.operator?.split('/')[0]}</span>
                <span className="text-[#34D399]">{gs.activePasses} active passes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroundStationsList;
