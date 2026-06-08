import React, { useState } from "react";
import { CATEGORIES, MOCK_REQUESTS, ACTIVITY_EVENTS } from "../constants";
import type { FilterType } from "../types";
import Badge from "../components/Badge";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("inicio");
  const [showProfile, setShowProfile] = useState(false);
  const [filter, setFilter] = useState<FilterType>("todas");
  const userName = "Maria Silva";

  const filtered = MOCK_REQUESTS.filter((r) => {
    if (filter === "abertas")
      return r.status === "ABERTO" || r.status === "EM EXECUÇÃO";
    if (filter === "concluidas") return r.status === "CONCLUÍDO";
    return true;
  });

  const tabs: [string, string, string][] = [
    ["inicio", "ti-home", "Início"],
    ["solicitacoes", "ti-list", "Minhas Solicitações"],
    ["notificacoes", "ti-bell", "Notificações"],
  ];

  const stats = [
    {
      label: "Total de solicitações",
      val: "12",
      icon: "ti-file-text",
      iconClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      label: "Em execução",
      val: "4",
      icon: "ti-clock-hour-4",
      iconClass: "text-sky-500",
      bgClass: "bg-sky-50",
    },
    {
      label: "Em aberto",
      val: "3",
      icon: "ti-circle-dot",
      iconClass: "text-orange-500",
      bgClass: "bg-orange-50",
    },
    {
      label: "Concluídas",
      val: "5",
      icon: "ti-circle-check",
      iconClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
  ];

  const filterOptions: [FilterType, string][] = [
    ["todas", "Todas"],
    ["abertas", "Em andamento"],
    ["concluidas", "Concluídas"],
  ];

  const profileMenu: [string, string][] = [
    ["ti-user", "Meu Perfil"],
    ["ti-settings", "Configurações"],
    ["ti-shield", "Privacidade"],
  ];

  return (
    <div className="font-sans bg-slate-50 min-h-screen text-slate-800">
      {/* TOPNAV */}
      <nav className="bg-white border-b border-slate-100 flex items-center justify-between px-10 h-16 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F2A4A] flex items-center justify-center">
              <i className="ti ti-eye text-white text-sm" aria-hidden="true" />
            </div>
            <span className="font-bold text-base text-[#0F2A4A] tracking-tight">
              Observ<span className="text-[#2E7BD4]">Ação</span>
            </span>
          </div>

          <div className="flex gap-1">
            {tabs.map(([id, icon, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === id
                    ? "bg-slate-50 border border-slate-200 font-bold text-[#0F2A4A]"
                    : "border border-transparent font-medium text-slate-500 hover:text-slate-700"
                }`}
              >
                <i className={`ti ${icon} text-base`} aria-hidden="true" />
                {label}
                {id === "notificacoes" && (
                  <span className="bg-red-500 text-white rounded-full text-[10px] font-bold px-1.5 py-px leading-none">
                    2
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="text-right">
              <div className="text-sm font-bold text-[#0F2A4A]">
                Maria Silva
              </div>
              <div className="text-[11px] text-slate-400">
                Cidadã verificada
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0F2A4A] flex items-center justify-center shrink-0">
              <span className="text-[13px] font-bold text-white">MS</span>
            </div>
            <i
              className="ti ti-chevron-down text-slate-400 text-sm"
              aria-hidden="true"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-slate-100 rounded-xl p-2 w-52 shadow-lg z-50">
              <div className="px-3.5 py-3 border-b border-slate-100 mb-1">
                <div className="font-bold text-sm text-[#0F2A4A]">
                  Maria Silva
                </div>
                <div className="text-xs text-slate-400">
                  maria.silva@email.com
                </div>
              </div>
              {profileMenu.map(([icon, label]) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-left font-[inherit]"
                >
                  <i
                    className={`ti ${icon} text-base text-slate-400`}
                    aria-hidden="true"
                  />
                  {label}
                </button>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors text-left font-[inherit]"
                >
                  <i className="ti ti-logout text-base" aria-hidden="true" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-[1180px] mx-auto px-10 py-9">
        {/* GREETING */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold mb-1.5 text-[#0F2A4A]">
              Olá, {userName} 👋
            </h1>
            <p className="text-slate-400 text-sm">
              Acompanhe suas solicitações ou registre um novo problema em sua
              região.
            </p>
          </div>
          <div className="flex gap-2.5">
            <div className="relative">
              <i
                className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por protocolo..."
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 w-60 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <button className="bg-[#2E7BD4] text-white rounded-xl px-5 text-sm font-bold hover:bg-blue-600 transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-9">
          {stats.map(({ label, val, icon, iconClass, bgClass }) => (
            <div
              key={label}
              className="bg-white border border-slate-100 rounded-2xl px-5 py-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-slate-400 font-semibold mb-2">
                    {label}
                  </div>
                  <div className="text-4xl font-extrabold text-[#0F2A4A]">
                    {val}
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}
                >
                  <i
                    className={`ti ${icon} text-xl ${iconClass}`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6">
          {/* REQUESTS LIST */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold mb-1 text-[#0F2A4A]">
                  Minhas Solicitações
                </h2>
                <p className="text-xs text-slate-400">
                  Acompanhe o status das suas demandas
                </p>
              </div>
              <div className="flex gap-1.5">
                {filterOptions.map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      filter === id
                        ? "bg-[#0F2A4A] text-white"
                        : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.map((req, i) => (
              <div
                key={req.id}
                className={`px-6 py-4.5 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  i < filtered.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <i
                    className={`ti ${req.icon} text-xl text-slate-500`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-[#0F2A4A] mb-1">
                    {req.type}
                  </div>
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <i
                        className="ti ti-map-pin text-[11px]"
                        aria-hidden="true"
                      />{" "}
                      {req.addr}
                    </span>
                    <span className="flex items-center gap-1">
                      <i
                        className="ti ti-calendar text-[11px]"
                        aria-hidden="true"
                      />{" "}
                      {req.date}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge status={req.status} variant={req.variant} />
                  <span className="text-[11px] text-slate-400 font-mono">
                    {req.id}
                  </span>
                </div>
                <i
                  className="ti ti-chevron-right text-slate-200 text-sm"
                  aria-hidden="true"
                />
              </div>
            ))}

            <div className="px-6 py-3.5 border-t border-slate-100">
              <a
                href="#"
                className="text-xs font-semibold text-[#2E7BD4] flex items-center gap-1 hover:underline"
              >
                Ver todas as solicitações{" "}
                <i className="ti ti-arrow-right text-xs" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="flex flex-col gap-5">
            {/* Nova Solicitação */}
            <div className="bg-[#0F2A4A] rounded-2xl p-6 text-white">
              <h3 className="text-sm font-bold mb-2">Nova Solicitação</h3>
              <p className="text-xs text-white/65 leading-relaxed mb-5">
                Selecione uma categoria para registrar um novo problema na sua
                região.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    className="bg-white/10 border border-white/15 rounded-xl py-2.5 px-1.5 flex flex-col items-center gap-1.5 hover:bg-white/20 transition-colors"
                  >
                    <i
                      className={`ti ${cat.icon} text-lg text-white/85`}
                      aria-hidden="true"
                    />
                    <span className="text-[9px] text-white/70 text-center leading-tight font-medium">
                      {cat.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
              <button className="w-full bg-amber-400 text-[#0F2A4A] rounded-xl py-2.5 text-xs font-bold hover:bg-amber-300 transition-colors">
                + Iniciar nova solicitação
              </button>
            </div>

            {/* Activity */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4 text-[#0F2A4A]">
                Atividade Recente
              </h3>
              <div className="flex flex-col gap-3.5">
                {ACTIVITY_EVENTS.map((ev, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <i
                        className={`ti ${ev.icon} text-base ${ev.iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-700 leading-relaxed mb-0.5">
                        {ev.msg}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {ev.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
