import React, { useState, useEffect, useRef } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { maskCPF, maskPhone } from "../../utils/masks";
import { validatePassword } from "../../utils/validators";
import { fetchStates, fetchCities, State, City } from "../../utils/ibgeApi";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onBack: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onBack }) => {
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    isFormValid,
    resetForm,
  } = useFormValidation();

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Ref para controlar qual estado foi carregado por último
  const lastLoadedState = useRef<string>("");

  // Carregar estados uma única vez
  useEffect(() => {
    fetchStates().then(setStates);
  }, []);

  // Carregar cidades apenas quando o estado mudar de valor
  useEffect(() => {
    if (!formData.state || formData.state === lastLoadedState.current) return;

    lastLoadedState.current = formData.state;
    setLoadingCities(true);
    setCities([]);

    fetchCities(formData.state).then((data) => {
      setCities(data);
      setLoadingCities(false);
    });
  }, [formData.state]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange("city", ""); // limpa cidade ao trocar estado
    handleChange("state", e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange("city", e.target.value);
  };

  const getPasswordStrength = () => validatePassword(formData.password).strength;

  const getPasswordRequirements = () => ({
    minLength: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%&*()_+\-=]/.test(formData.password),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 2000);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    resetForm();
    onSignupSuccess();
  };

  const requirements = getPasswordRequirements();
  const passwordStrength = getPasswordStrength();

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 1rem center",
    backgroundSize: "1.5em 1.5em",
    paddingRight: "2.5rem",
  };

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 via-white to-slate-100 min-h-screen py-12 px-4">
      <button
        onClick={onBack}
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium z-40"
      >
        <i className="ti ti-arrow-left text-lg" aria-hidden="true" />
        Voltar
      </button>

      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0F2A4A] to-[#1A3D6B] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="ti ti-user-plus text-white text-2xl" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F2A4A] mb-2">Criar Conta</h1>
          <p className="text-slate-500 text-sm">
            Preencha os dados abaixo para registrar-se na plataforma
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NOME COMPLETO */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-bold text-slate-800 mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                onBlur={() => handleBlur("fullName")}
                placeholder="Seu nome e sobrenome"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.fullName && errors.fullName
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              />
              {touched.fullName && errors.fullName && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-2">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="seu@email.com"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.email && errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-sm font-bold text-slate-800 mb-2">
                CPF <span className="text-red-500">*</span>
              </label>
              <input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", maskCPF(e.target.value))}
                onBlur={() => handleBlur("cpf")}
                placeholder="000.000.000-00"
                maxLength={14}
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.cpf && errors.cpf
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              />
              {touched.cpf && errors.cpf && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.cpf}
                </p>
              )}
            </div>

            {/* TELEFONE */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-800 mb-2">
                Celular / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", maskPhone(e.target.value))}
                onBlur={() => handleBlur("phone")}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.phone && errors.phone
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              />
              {touched.phone && errors.phone && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* ESTADO E CIDADE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="state" className="block text-sm font-bold text-slate-800 mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  onBlur={() => handleBlur("state")}
                  style={selectStyle}
                  className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer ${
                    touched.state && errors.state
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-400"
                  }`}
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.sigla}>
                      {state.name} ({state.sigla})
                    </option>
                  ))}
                </select>
                {touched.state && errors.state && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <i className="ti ti-alert-circle" aria-hidden="true" />
                    {errors.state}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-bold text-slate-800 mb-2">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  onBlur={() => handleBlur("city")}
                  disabled={!formData.state || loadingCities}
                  style={selectStyle}
                  className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer ${
                    touched.city && errors.city
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-400"
                  } ${!formData.state || loadingCities ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">
                    {loadingCities ? "Carregando..." : "Selecione uma cidade"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {touched.city && errors.city && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <i className="ti ti-alert-circle" aria-hidden="true" />
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            {/* SENHA */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-2">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.password && errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              />
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength === "weak"
                            ? index === 0 ? "bg-red-500" : "bg-slate-200"
                            : passwordStrength === "medium"
                              ? index <= 1 ? "bg-yellow-500" : "bg-slate-200"
                              : "bg-green-500"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold ${
                    passwordStrength === "weak" ? "text-red-500"
                      : passwordStrength === "medium" ? "text-yellow-500"
                      : "text-green-500"
                  }`}>
                    Força:{" "}
                    {passwordStrength === "weak" ? "Fraca"
                      : passwordStrength === "medium" ? "Média"
                      : "Forte"}
                  </p>
                  <div className="space-y-1 mt-3 text-xs">
                    {[
                      { check: requirements.minLength, label: "Mínimo 8 caracteres" },
                      { check: requirements.uppercase, label: "Pelo menos 1 letra maiúscula (A-Z)" },
                      { check: requirements.lowercase, label: "Pelo menos 1 letra minúscula (a-z)" },
                      { check: requirements.number, label: "Pelo menos 1 número (0-9)" },
                      { check: requirements.special, label: "Pelo menos 1 caractere especial (!@#$%&*()_+=-)" },
                    ].map((req, i) => (
                      <div key={i} className={`flex items-center gap-2 ${req.check ? "text-green-600" : "text-slate-400"}`}>
                        <i className={`ti text-sm ${req.check ? "ti-check" : "ti-circle"}`} aria-hidden="true" />
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRMAR SENHA */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-800 mb-2">
                Confirmar Senha <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-[#0F2A4A] to-[#1A3D6B] text-white rounded-lg px-4 py-3.5 text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader animate-spin" aria-hidden="true" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <i className="ti ti-user-plus" aria-hidden="true" />
                  Cadastrar
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 mt-6">
            <p>
              Ao se registrar, você concorda com nossos{" "}
              <button className="text-[#2E7BD4] hover:underline font-medium">Termos de Uso</button>{" "}
              e{" "}
              <button className="text-[#2E7BD4] hover:underline font-medium">Política de Privacidade</button>
            </p>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ti ti-check text-3xl text-green-600" aria-hidden="true" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A4A] text-center mb-2">Tudo certo!</h2>
            <p className="text-slate-600 text-center text-sm mb-6">
              Seu cadastro foi realizado com sucesso. Você será redirecionado para o login.
            </p>
            <button
              onClick={handleSuccessConfirm}
              className="w-full bg-[#0F2A4A] text-white rounded-lg px-4 py-3 text-sm font-bold hover:bg-[#1A3D6B] transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;