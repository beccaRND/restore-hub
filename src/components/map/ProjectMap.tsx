import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { FarmProject } from '../../types/project';
import { AVAILABILITY_LABELS, PRACTICE_LABELS, STAGE_LABELS } from '../../types/project';
import type { PracticeType } from '../../types/project';
import { formatNumber, formatCurrency, formatCarbonRange } from '../../lib/formatters';
import 'leaflet/dist/leaflet.css';

interface ProjectMapProps {
  projects: FarmProject[];
}

const AVAILABILITY_COLORS: Record<string, string> = {
  available: '#2D6A4F',
  in_conversation: '#C9A227',
  committed: '#8B6914',
  private: '#94a3b8',
};

// Fit map bounds to project markers
function FitBounds({ projects }: { projects: FarmProject[] }) {
  const map = useMap();

  useEffect(() => {
    if (projects.length === 0) return;
    const bounds = projects.map((p) => [p.location.lat, p.location.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }, [projects, map]);

  return null;
}

export default function ProjectMap({ projects }: ProjectMapProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Default center: US continental
  const center: [number, number] = [39.5, -98.5];

  return (
    <div className="rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Legend */}
      <div
        className="flex items-center gap-4 px-4 py-2.5 border-b"
        style={{ backgroundColor: 'var(--zfp-white)', borderColor: 'var(--zfp-border)' }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--zfp-text-light)' }}>
          Availability
        </span>
        {Object.entries(AVAILABILITY_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px]" style={{ color: 'var(--zfp-text-muted)' }}>
              {AVAILABILITY_LABELS[key as keyof typeof AVAILABILITY_LABELS]}
            </span>
          </div>
        ))}
        <span className="ml-auto text-[11px]" style={{ color: 'var(--zfp-text-light)', fontFamily: 'var(--font-mono)' }}>
          {projects.length} projects
        </span>
      </div>

      <MapContainer
        center={center}
        zoom={5}
        style={{ height: 560, width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds projects={projects} />

        {projects.map((project) => {
          const color = AVAILABILITY_COLORS[project.availability] || '#94a3b8';
          const isSelected = selectedProject === project.id;
          // Scale radius by acreage (min 5, max 14)
          const radius = Math.min(14, Math.max(5, Math.sqrt(project.acreage) * 0.7));

          return (
            <CircleMarker
              key={project.id}
              center={[project.location.lat, project.location.lng]}
              radius={isSelected ? radius + 3 : radius}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: isSelected ? 0.9 : 0.65,
                weight: isSelected ? 2.5 : 1.5,
                opacity: 0.9,
              }}
              eventHandlers={{
                click: () => setSelectedProject(project.id),
              }}
            >
              <Popup>
                <MapPopup project={project} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function MapPopup({ project }: { project: FarmProject }) {
  return (
    <div style={{ minWidth: 220, maxWidth: 280, fontFamily: 'var(--font-body)' }}>
      <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: '#1a1a1a' }}>
        {project.farmName}
      </p>
      <p style={{ fontSize: 11, color: '#6b7280', margin: '0 0 8px' }}>
        {project.location.county}, {project.location.state}
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>Acres</p>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, fontFamily: 'var(--font-mono)' }}>
            {formatNumber(project.acreage)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>Grant</p>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, fontFamily: 'var(--font-mono)' }}>
            {formatCurrency(project.grantAmount)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>Carbon</p>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, fontFamily: 'var(--font-mono)' }}>
            {formatCarbonRange(project.cometEstimate.low, project.cometEstimate.high)}
          </p>
        </div>
      </div>

      {/* Practices */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {project.practices.slice(0, 3).map((p) => (
          <span
            key={p}
            style={{
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              backgroundColor: '#f0fdf4',
              color: '#2D6A4F',
            }}
          >
            {PRACTICE_LABELS[p as PracticeType]}
          </span>
        ))}
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: AVAILABILITY_COLORS[project.availability] || '#94a3b8',
          }}
        >
          {AVAILABILITY_LABELS[project.availability]} · {STAGE_LABELS[project.status]}
        </span>
        <Link
          to={`/projects/${project.id}`}
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: '#2D6A4F',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            textDecoration: 'none',
          }}
        >
          Details <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}
