"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye,
  Check,
} from 'lucide-react';

// Type definitions
interface Rubro {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  imagenFondo: string;
}

interface Categoria {
  id: string;
  rubroId: string;
  nombre: string;
  slug: string;
  imagenFondo: string;
}

interface Negocio {
  id: string;
  rubroId: string;
  categoriaId: string | null;
  nombre: string;
  slug: string;
  descripcion: string;
  direccion: string;
  telefono: string | null;
  email: string | null;
  web: string | null;
  instagram: string | null;
  facebook: string | null;
  verificado: boolean;
  imagen: string | null;
  horario: string | null;
}

// Slug generator utility
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function DashboardContainer() {
  const [activeTab, setActiveTab] = useState<'rubros' | 'categorias' | 'negocios'>('rubros');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Data states
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRubroId, setFilterRubroId] = useState('');
  const [filterCategoriaId, setFilterCategoriaId] = useState('');

  // Modal / Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [rubroForm, setRubroForm] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    imagenFondo: '',
  });

  const [categoriaForm, setCategoriaForm] = useState({
    nombre: '',
    slug: '',
    rubroId: '',
    imagenFondo: '',
  });

  const [negocioForm, setNegocioForm] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    web: '',
    instagram: '',
    facebook: '',
    verificado: false,
    imagen: '',
    horario: '',
    rubroId: '',
    categoriaId: '',
  });

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('No se pudieron obtener los datos.');
      }
      const data = await res.json();
      setRubros(data.rubros || []);
      setCategorias(data.categorias || []);
      setNegocios(data.negocios || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de servidor al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    if (!confirm('¿Seguro que deseas cerrar la sesión?')) return;
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-slug triggers
  const handleNameChange = (nameValue: string) => {
    const generatedSlug = slugify(nameValue);
    if (activeTab === 'rubros') {
      setRubroForm((prev) => ({ ...prev, nombre: nameValue, slug: generatedSlug }));
    } else if (activeTab === 'categorias') {
      setCategoriaForm((prev) => ({ ...prev, nombre: nameValue, slug: generatedSlug }));
    } else if (activeTab === 'negocios') {
      setNegocioForm((prev) => ({ ...prev, nombre: nameValue, slug: generatedSlug }));
    }
  };

  // Open Form Modal
  const openModal = (mode: 'create' | 'edit', item?: any) => {
    setModalMode(mode);
    setFormError('');
    setIsModalOpen(true);

    if (mode === 'create') {
      setEditingItem(null);
      // Reset forms
      setRubroForm({ nombre: '', slug: '', descripcion: '', imagenFondo: '' });
      setCategoriaForm({ nombre: '', slug: '', rubroId: filterRubroId || '', imagenFondo: '' });
      setNegocioForm({
        nombre: '',
        slug: '',
        descripcion: '',
        direccion: '',
        telefono: '',
        email: '',
        web: '',
        instagram: '',
        facebook: '',
        verificado: false,
        imagen: '',
        horario: '',
        rubroId: filterRubroId || '',
        categoriaId: filterCategoriaId || '',
      });
    } else {
      setEditingItem(item);
      if (activeTab === 'rubros') {
        setRubroForm({
          nombre: item.nombre,
          slug: item.slug,
          descripcion: item.descripcion || '',
          imagenFondo: item.imagenFondo || '',
        });
      } else if (activeTab === 'categorias') {
        setCategoriaForm({
          nombre: item.nombre,
          slug: item.slug,
          rubroId: item.rubroId,
          imagenFondo: item.imagenFondo || '',
        });
      } else if (activeTab === 'negocios') {
        setNegocioForm({
          nombre: item.nombre,
          slug: item.slug,
          descripcion: item.descripcion || '',
          direccion: item.direccion,
          telefono: item.telefono || '',
          email: item.email || '',
          web: item.web || '',
          instagram: item.instagram || '',
          facebook: item.facebook || '',
          verificado: !!item.verificado,
          imagen: item.imagen || '',
          horario: item.horario || '',
          rubroId: item.rubroId || '',
          categoriaId: item.categoriaId || '',
        });
      }
    }
  };

  // Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    let url = `/api/admin/${activeTab}`;
    let method = 'POST';
    let bodyData: any = {};

    if (modalMode === 'edit' && editingItem) {
      url = `/api/admin/${activeTab}/${editingItem.id}`;
      method = 'PUT';
    }

    if (activeTab === 'rubros') {
      bodyData = rubroForm;
    } else if (activeTab === 'categorias') {
      bodyData = categoriaForm;
    } else if (activeTab === 'negocios') {
      bodyData = negocioForm;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud.');
      }

      setIsModalOpen(false);
      // Reload page data
      await loadData();
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (item: any) => {
    let warningMsg = `¿Estás seguro de que deseas eliminar "${item.nombre}"?`;
    
    if (activeTab === 'rubros') {
      // Check if it has child categories
      const children = categorias.filter((c) => c.rubroId === item.id);
      if (children.length > 0) {
        alert(
          `No se puede eliminar el rubro porque tiene ${children.length} categorías asociadas. Elimina o reasigna las categorías primero.`
        );
        return;
      }
    } else if (activeTab === 'categorias') {
      // Check if it has child businesses
      const children = negocios.filter((n) => n.categoriaId === item.id);
      if (children.length > 0) {
        alert(
          `No se puede eliminar la categoría porque tiene ${children.length} negocios asociados. Elimina o reasigna los negocios primero.`
        );
        return;
      }
    }

    if (!confirm(warningMsg)) return;

    try {
      const res = await fetch(`/api/admin/${activeTab}/${item.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar el registro.');
      }
      // Refresh
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error al intentar eliminar.');
    }
  };

  // Helpers to get parent names
  const getRubroName = (rubroId: string) => {
    return rubros.find((r) => r.id === rubroId)?.nombre || 'Desconocido';
  };

  const getCategoriaName = (categoriaId: string | null) => {
    if (!categoriaId) return 'Ninguna (General)';
    return categorias.find((c) => c.id === categoriaId)?.nombre || 'Desconocida';
  };

  // Filtering data for rendering
  const filteredRubros = rubros.filter(
    (r) =>
      r.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategorias = categorias.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRubro = !filterRubroId || c.rubroId === filterRubroId;
    return matchesSearch && matchesRubro;
  });

  const filteredNegocios = negocios.filter((n) => {
    const matchesSearch =
      n.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.descripcion && n.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRubro = !filterRubroId || n.rubroId === filterRubroId;
    const matchesCategoria = !filterCategoriaId || n.categoriaId === filterCategoriaId;
    return matchesSearch && matchesRubro && matchesCategoria;
  });

  // Keep filters sync
  useEffect(() => {
    // Reset category filter if it belongs to a rubro that was unselected
    if (filterRubroId) {
      const isCatInRubro = categorias.some(
        (c) => c.id === filterCategoriaId && c.rubroId === filterRubroId
      );
      if (!isCatInRubro) {
        setFilterCategoriaId('');
      }
    } else {
      setFilterCategoriaId('');
    }
  }, [filterRubroId, categorias, filterCategoriaId]);

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-16 py-12 flex flex-col gap-8 pb-32">
      {/* Title Header Row */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-on-background pb-6">
        <div>
          <div className="bg-secondary-fixed border-2 border-on-background px-3 py-1 font-headline text-xs font-black uppercase inline-block mb-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            CONEXIÓN ESTABLECIDA
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-black uppercase text-on-background tracking-tight">
            Panel de Control
          </h1>
          <p className="font-sans text-sm text-on-surface-variant font-medium mt-1">
            Administra los Rubros, Categorías y Fichas de Comercios en tiempo real.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-tertiary text-white font-headline text-xs font-black uppercase tracking-wider px-5 py-3 border-4 border-on-background shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer font-bold"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </header>

      {/* Main error display */}
      {error && (
        <div className="bg-tertiary text-white border-4 border-on-background p-6 font-sans font-bold flex items-center gap-4 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <div>
            <p className="text-lg">ERROR AL CARGAR DATOS</p>
            <p className="text-sm font-medium opacity-90">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 bg-white text-on-background px-4 py-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs font-black uppercase hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer font-bold"
            >
              Reintentar Carga
            </button>
          </div>
        </div>
      )}

      {/* Tabs Row */}
      <nav className="flex flex-wrap gap-4 border-b-2 border-on-background/20 pb-4">
        {[
          { id: 'rubros', label: 'Rubros', color: '#8000c6', count: rubros.length },
          { id: 'categorias', label: 'Categorías', color: '#0099ff', count: categorias.length },
          { id: 'negocios', label: 'Negocios', color: '#FF9900', count: negocios.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchQuery('');
                setFilterRubroId('');
                setFilterCategoriaId('');
              }}
              className={`flex items-center gap-2 px-6 py-3 border-4 border-on-background font-headline text-sm font-black uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all cursor-pointer select-none font-bold
                ${isActive ? 'bg-secondary-fixed text-on-background translate-y-0.5 translate-x-0.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-white text-on-background hover:scale-105'}
              `}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-on-background inline-block shrink-0"
                style={{ backgroundColor: tab.color }}
              ></span>
              {tab.label}
              <span className="bg-slate-100 border border-on-background text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Search and Filters Bar */}
      <section className="bg-white border-4 border-on-background p-6 brutal-shadow flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        {/* Search */}
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder={`Buscar en ${activeTab === 'rubros' ? 'Rubros' : activeTab === 'categorias' ? 'Categorías' : 'Negocios'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-4 border-on-background p-3 pl-12 font-sans font-medium focus:bg-white focus:outline-none transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Rubro Filter (for Categorias and Negocios) */}
          {(activeTab === 'categorias' || activeTab === 'negocios') && (
            <div className="flex items-center gap-2 border-2 border-on-background bg-slate-100 px-3 py-1 font-label text-xs font-bold uppercase rounded">
              <Filter className="w-3.5 h-3.5" />
              <span>Rubro:</span>
              <select
                value={filterRubroId}
                onChange={(e) => setFilterRubroId(e.target.value)}
                className="bg-transparent focus:outline-none font-sans font-medium pr-4 cursor-pointer"
              >
                <option value="">TODOS</option>
                {rubros.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Categoria Filter (only for Negocios, cascading) */}
          {activeTab === 'negocios' && (
            <div className="flex items-center gap-2 border-2 border-on-background bg-slate-100 px-3 py-1 font-label text-xs font-bold uppercase rounded">
              <Filter className="w-3.5 h-3.5" />
              <span>Categoría:</span>
              <select
                value={filterCategoriaId}
                onChange={(e) => setFilterCategoriaId(e.target.value)}
                className="bg-transparent focus:outline-none font-sans font-medium pr-4 cursor-pointer"
              >
                <option value="">TODAS</option>
                {categorias
                  .filter((c) => !filterRubroId || c.rubroId === filterRubroId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre.toUpperCase()}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* New Item CTA */}
          <button
            onClick={() => openModal('create')}
            className="bg-primary text-white border-2 border-on-background px-4 py-2 font-headline text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer font-bold"
          >
            <Plus className="w-4 h-4" />
            Crear {activeTab === 'rubros' ? 'Rubro' : activeTab === 'categorias' ? 'Categoría' : 'Negocio'}
          </button>
        </div>
      </section>

      {/* Loading state spinner */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white border-4 border-on-background brutal-shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <span className="font-headline text-sm font-black uppercase text-on-surface-variant">
            Cargando registros...
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border-4 border-on-background brutal-shadow">
          {activeTab === 'rubros' && (
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-primary text-white border-b-4 border-on-background font-headline text-xs font-black uppercase tracking-wider">
                  <th className="p-4 border-r-2 border-on-background">Imagen</th>
                  <th className="p-4 border-r-2 border-on-background">Nombre</th>
                  <th className="p-4 border-r-2 border-on-background">Slug</th>
                  <th className="p-4 border-r-2 border-on-background">Descripción</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-on-background">
                {filteredRubros.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant font-medium">
                      No se encontraron rubros con los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredRubros.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors font-medium">
                      <td className="p-4 border-r-2 border-on-background w-24">
                        {item.imagenFondo ? (
                          <img
                            src={item.imagenFondo}
                            alt={item.nombre}
                            className="w-12 h-12 object-cover border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 border-2 border-on-background bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                            S/I
                          </div>
                        )}
                      </td>
                      <td className="p-4 border-r-2 border-on-background font-bold text-on-background">
                        {item.nombre}
                      </td>
                      <td className="p-4 border-r-2 border-on-background font-mono text-xs">
                        {item.slug}
                      </td>
                      <td className="p-4 border-r-2 border-on-background text-sm text-on-surface-variant max-w-xs truncate">
                        {item.descripcion}
                      </td>
                      <td className="p-4 text-center w-48">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal('edit', item)}
                            className="bg-secondary-fixed text-on-background p-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="bg-tertiary text-white p-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'categorias' && (
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-[#0099ff] text-white border-b-4 border-on-background font-headline text-xs font-black uppercase tracking-wider">
                  <th className="p-4 border-r-2 border-on-background">Imagen</th>
                  <th className="p-4 border-r-2 border-on-background">Nombre</th>
                  <th className="p-4 border-r-2 border-on-background">Slug</th>
                  <th className="p-4 border-r-2 border-on-background">Rubro Padre</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-on-background">
                {filteredCategorias.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant font-medium">
                      No se encontraron categorías.
                    </td>
                  </tr>
                ) : (
                  filteredCategorias.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors font-medium">
                      <td className="p-4 border-r-2 border-on-background w-24">
                        {item.imagenFondo ? (
                          <img
                            src={item.imagenFondo}
                            alt={item.nombre}
                            className="w-12 h-12 object-cover border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 border-2 border-on-background bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                            S/I
                          </div>
                        )}
                      </td>
                      <td className="p-4 border-r-2 border-on-background font-bold text-on-background">
                        {item.nombre}
                      </td>
                      <td className="p-4 border-r-2 border-on-background font-mono text-xs">
                        {item.slug}
                      </td>
                      <td className="p-4 border-r-2 border-on-background">
                        <span className="bg-purple-100 text-primary border border-primary/20 text-xs font-bold px-2.5 py-1 rounded">
                          {getRubroName(item.rubroId).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center w-48">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal('edit', item)}
                            className="bg-secondary-fixed text-on-background p-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="bg-tertiary text-white p-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'negocios' && (
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-secondary-fixed text-on-background border-b-4 border-on-background font-headline text-[10px] font-black uppercase tracking-wider">
                  <th className="p-3 border-r-2 border-on-background">Imagen</th>
                  <th className="p-3 border-r-2 border-on-background">Nombre</th>
                  <th className="p-3 border-r-2 border-on-background">Dirección</th>
                  <th className="p-3 border-r-2 border-on-background">Vínculos</th>
                  <th className="p-3 border-r-2 border-on-background">Contacto / Redes</th>
                  <th className="p-3 border-r-2 border-on-background text-center">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-background">
                {filteredNegocios.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant font-medium">
                      No se encontraron negocios.
                    </td>
                  </tr>
                ) : (
                  filteredNegocios.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors font-medium">
                      <td className="p-3 border-r-2 border-on-background w-16">
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="w-10 h-10 object-cover border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 border-2 border-on-background bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                            S/I
                          </div>
                        )}
                      </td>
                      <td className="p-3 border-r-2 border-on-background">
                        <div className="font-bold text-sm text-on-background">{item.nombre}</div>
                        <div className="font-mono text-[9px] text-on-surface-variant">{item.slug}</div>
                      </td>
                      <td className="p-3 border-r-2 border-on-background">
                        <div>{item.direccion}</div>
                        {item.horario && <div className="text-[10px] text-primary mt-1 font-semibold">{item.horario}</div>}
                      </td>
                      <td className="p-3 border-r-2 border-on-background">
                        <div className="flex flex-col gap-1">
                          <span className="bg-purple-100 text-primary border border-primary/20 text-[9px] font-bold px-1.5 py-0.5 rounded w-max">
                            R: {getRubroName(item.rubroId).toUpperCase()}
                          </span>
                          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[9px] font-bold px-1.5 py-0.5 rounded w-max">
                            C: {getCategoriaName(item.categoriaId).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 border-r-2 border-on-background font-mono text-[10px]">
                        <div className="space-y-0.5">
                          {item.telefono && <div>TEL: {item.telefono}</div>}
                          {item.email && <div className="truncate max-w-[150px]">EMAIL: {item.email}</div>}
                          {item.web && <div className="truncate max-w-[150px] text-blue-600">WEB: {item.web}</div>}
                          {item.instagram && <div>IG: @{item.instagram}</div>}
                        </div>
                      </td>
                      <td className="p-3 border-r-2 border-on-background text-center">
                        {item.verificado ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Verif.
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-slate-100 text-slate-500 border border-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            No
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center w-36">
                        <div className="flex justify-center gap-1.5">
                          <a
                            href={`/negocio/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-on-background p-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center"
                            title="Ver Ficha Pública"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => openModal('edit', item)}
                            className="bg-secondary-fixed text-on-background p-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="bg-tertiary text-white p-2 border-2 border-on-background shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CRUD Overlay Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border-4 border-on-background brutal-shadow my-8 relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <header className="bg-primary text-white border-b-4 border-on-background p-5 flex justify-between items-center shrink-0">
              <h2 className="font-headline text-xl font-black uppercase">
                {modalMode === 'create' ? 'Crear' : 'Editar'} {activeTab === 'rubros' ? 'Rubro' : activeTab === 'categorias' ? 'Categoría' : 'Negocio'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white text-on-background border-2 border-on-background p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="bg-tertiary text-white border-2 border-on-background p-4 font-sans text-xs font-semibold flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Entity: RUBROS Form fields */}
              {activeTab === 'rubros' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">Nombre</label>
                    <input
                      type="text"
                      value={rubroForm.nombre}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 hidden">
                    <label className="font-label text-xs uppercase font-bold text-on-background">Slug (Generado)</label>
                    <input
                      type="text"
                      value={rubroForm.slug}
                      onChange={(e) => setRubroForm({ ...rubroForm, slug: slugify(e.target.value) })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-mono text-xs focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">Descripción</label>
                    <textarea
                      rows={3}
                      value={rubroForm.descripcion}
                      onChange={(e) => setRubroForm({ ...rubroForm, descripcion: e.target.value })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">URL Imagen Fondo</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={rubroForm.imagenFondo}
                      onChange={(e) => setRubroForm({ ...rubroForm, imagenFondo: e.target.value })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                    />
                    {rubroForm.imagenFondo && (
                      <div className="mt-2 border-2 border-on-background p-1 w-32 aspect-video bg-slate-50 relative overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <img
                          src={rubroForm.imagenFondo}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Entity: CATEGORIAS Form fields */}
              {activeTab === 'categorias' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">Nombre</label>
                    <input
                      type="text"
                      value={categoriaForm.nombre}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 hidden">
                    <label className="font-label text-xs uppercase font-bold text-on-background">Slug (Generado)</label>
                    <input
                      type="text"
                      value={categoriaForm.slug}
                      onChange={(e) => setCategoriaForm({ ...categoriaForm, slug: slugify(e.target.value) })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-mono text-xs focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">Rubro Superior</label>
                    <select
                      value={categoriaForm.rubroId}
                      onChange={(e) => setCategoriaForm({ ...categoriaForm, rubroId: e.target.value })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-semibold focus:bg-white focus:outline-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>SELECCIONA UN RUBRO</option>
                      {rubros.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">URL Imagen Fondo</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={categoriaForm.imagenFondo}
                      onChange={(e) => setCategoriaForm({ ...categoriaForm, imagenFondo: e.target.value })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                    />
                    {categoriaForm.imagenFondo && (
                      <div className="mt-2 border-2 border-on-background p-1 w-32 aspect-video bg-slate-50 relative overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <img
                          src={categoriaForm.imagenFondo}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Entity: NEGOCIOS Form fields */}
              {activeTab === 'negocios' && (
                <div className="space-y-4">
                  {/* Nombre & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Nombre Comercial</label>
                      <input
                        type="text"
                        value={negocioForm.nombre}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 hidden">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Slug (Generado)</label>
                      <input
                        type="text"
                        value={negocioForm.slug}
                        onChange={(e) => setNegocioForm({ ...negocioForm, slug: slugify(e.target.value) })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-mono text-xs focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Rubro & Categoria Parents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Rubro Principal</label>
                      <select
                        value={negocioForm.rubroId}
                        onChange={(e) => {
                          setNegocioForm({ ...negocioForm, rubroId: e.target.value, categoriaId: '' });
                        }}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-semibold focus:bg-white focus:outline-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>SELECCIONA UN RUBRO</option>
                        {rubros.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nombre.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Categoría Específica</label>
                      <select
                        value={negocioForm.categoriaId}
                        onChange={(e) => setNegocioForm({ ...negocioForm, categoriaId: e.target.value })}
                        disabled={!negocioForm.rubroId}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-semibold focus:bg-white focus:outline-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                      >
                        <option value="">NINGUNA (GENERAL)</option>
                        {categorias
                          .filter((c) => c.rubroId === negocioForm.rubroId)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre.toUpperCase()}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Descripcion & Direccion */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">Descripción de Servicios</label>
                    <textarea
                      rows={3}
                      value={negocioForm.descripcion}
                      onChange={(e) => setNegocioForm({ ...negocioForm, descripcion: e.target.value })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Dirección Física</label>
                      <input
                        type="text"
                        placeholder="Ej: Pellegrini 123"
                        value={negocioForm.direccion}
                        onChange={(e) => setNegocioForm({ ...negocioForm, direccion: e.target.value })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Horario de Atención</label>
                      <input
                        type="text"
                        placeholder="Ej: Lunes a Sábados 9:00 a 20:00"
                        value={negocioForm.horario}
                        onChange={(e) => setNegocioForm({ ...negocioForm, horario: e.target.value })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Teléfono</label>
                      <input
                        type="tel"
                        placeholder="Ej: 2346123456"
                        value={negocioForm.telefono}
                        onChange={(e) => setNegocioForm({ ...negocioForm, telefono: e.target.value })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Email</label>
                      <input
                        type="email"
                        placeholder="contacto@empresa.com"
                        value={negocioForm.email}
                        onChange={(e) => setNegocioForm({ ...negocioForm, email: e.target.value })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Sitio Web</label>
                      <input
                        type="url"
                        placeholder="https://empresa.com"
                        value={negocioForm.web}
                        onChange={(e) => setNegocioForm({ ...negocioForm, web: e.target.value })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Redes Sociales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Instagram (Usuario)</label>
                      <input
                        type="text"
                        placeholder="Ej: mi_comercio"
                        value={negocioForm.instagram}
                        onChange={(e) => setNegocioForm({ ...negocioForm, instagram: e.target.value })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-label text-xs uppercase font-bold text-on-background">Facebook (Usuario/Página)</label>
                      <input
                        type="text"
                        placeholder="Ej: mi.comercio.oficial"
                        value={negocioForm.facebook}
                        onChange={(e) => setNegocioForm({ ...negocioForm, facebook: e.target.value })}
                        className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Imagen & Verificado */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-xs uppercase font-bold text-on-background">URL Imagen del Comercio</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={negocioForm.imagen}
                      onChange={(e) => setNegocioForm({ ...negocioForm, imagen: e.target.value })}
                      className="bg-slate-50 border-2 border-on-background p-3 font-sans font-medium focus:bg-white focus:outline-none"
                    />
                    {negocioForm.imagen && (
                      <div className="mt-2 border-2 border-on-background p-1 w-32 aspect-video bg-slate-50 relative overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <img
                          src={negocioForm.imagen}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border-2 border-on-background p-4 shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-2">
                    <input
                      type="checkbox"
                      id="verificado"
                      checked={negocioForm.verificado}
                      onChange={(e) => setNegocioForm({ ...negocioForm, verificado: e.target.checked })}
                      className="w-5 h-5 border-2 border-on-background text-primary focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="verificado" className="font-label text-xs uppercase font-bold text-on-background cursor-pointer select-none">
                      Marcar como Comercio Verificado
                    </label>
                  </div>
                </div>
              )}
            </form>

            {/* Modal Footer Actions */}
            <footer className="bg-slate-50 border-t-4 border-on-background p-5 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-white border-2 border-on-background px-4 py-2 font-headline text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all cursor-pointer font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={submitting}
                className="bg-secondary-fixed text-on-background border-2 border-on-background px-5 py-2 font-headline text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
