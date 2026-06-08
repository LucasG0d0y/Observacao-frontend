import React, { useState } from "react";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  onSignup?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBack,
  onSignup,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulando autenticação
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 to-slate-100 min-h-screen flex items-center justify-center px-4">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium"
      >
        <i className="ti ti-arrow-left text-lg" aria-hidden="true" />
        Voltar
      </button>

      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#0F2A4A] flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-eye text-white text-xl" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F2A4A] mb-2">
            Observ<span className="text-[#2E7BD4]">Ação</span>
          </h1>
          <p className="text-slate-500 text-sm">
            {isLogin ? "Faça login na sua conta" : "Crie sua conta"}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME - SIGNUP ONLY */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required={!isLogin}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
            )}

            {/* CPF - SIGNUP ONLY */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required={!isLogin}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>

            {/* FORGOT PASSWORD - LOGIN ONLY */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-[#2E7BD4] hover:underline font-medium"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F2A4A] text-white rounded-lg px-4 py-3 text-sm font-bold hover:bg-[#1A3D6B] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader animate-spin" aria-hidden="true" />
                  Processando...
                </>
              ) : isLogin ? (
                <>
                  <i className="ti ti-login" aria-hidden="true" />
                  Entrar
                </>
              ) : (
                <>
                  <i className="ti ti-user-plus" aria-hidden="true" />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-500">Ou</span>
            </div>
          </div>

          {/* TOGGLE LOGIN/SIGNUP */}
          <button
            type="button"
            onClick={() => {
              if (onSignup) {
                onSignup();
              } else {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
                setName("");
                setCpf("");
              }
            }}
            className="w-full border border-slate-200 text-slate-800 rounded-lg px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
          </button>
        </div>

        {/* INFO TEXT */}
        <div className="text-center text-xs text-slate-500">
          <p>
            Ao se registrar, você concorda com nossos{" "}
            <button className="text-[#2E7BD4] hover:underline font-medium">
              Termos de Uso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
