import { Code2, Cpu, Database, Layers, Network } from 'lucide-react'

export const dashboardNav = [
  { id: 'dsa', label: 'DSA', path: '/dsa', icon: Code2 },
  { id: 'os', label: 'OS', path: '/os', icon: Cpu },
  { id: 'cn', label: 'CN', path: '/cn', icon: Network },
  { id: 'dbms', label: 'DBMS', path: '/dbms', icon: Database },
  {
    id: 'fullstack',
    label: 'Full Stack Development',
    path: '/full-stack',
    icon: Layers,
  },
]
