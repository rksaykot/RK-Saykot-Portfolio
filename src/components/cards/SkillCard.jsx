import { Code2, Server, Smartphone, Wrench, Sparkles, Layout, Database, Terminal, Palette, Laptop, MessageSquare } from 'lucide-react';
import Tag from '../ui/Tag';

function getIconForGroup(groupName) {
  const name = groupName.toLowerCase();
  if (name.includes('frontend') || name.includes('ui') || name.includes('interface')) return Layout;
  if (name.includes('backend') || name.includes('server') || name.includes('database')) return Database;
  if (name.includes('programming') || name.includes('language') || name.includes('code')) return Terminal;
  if (name.includes('design') || name.includes('graphics') || name.includes('ui/ux')) return Palette;
  if (name.includes('office') || name.includes('computer') || name.includes('hardware')) return Laptop;
  if (name.includes('communication') || name.includes('soft skill')) return MessageSquare;
  if (name.includes('mobile') || name.includes('app')) return Smartphone;
  if (name.includes('tool') || name.includes('platform')) return Wrench;
  return Sparkles; // fallback
}

export default function SkillCard({ group, items, index }) {
  const Icon = getIconForGroup(group);

  return (
    <div
      className="rv group rounded-box border border-base-300 bg-base-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-field border border-base-300 bg-base-200 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <div>
          <span className="block font-mono text-[0.68rem] uppercase tracking-[0.14em] text-base-content/40">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-lg font-semibold leading-tight">{group}</h3>
        </div>
      </div>

      <hr className="my-5 border-base-300" />

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </div>
  );
}
