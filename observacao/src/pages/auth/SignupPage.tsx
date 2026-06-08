import React, { useState, useEffect } from "react";
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

  // Carregar estados ao montar componente
  useEffect(() => {
    const loadStates = async () => {
      const statesData = await fetchStates();
      setStates(statesData);
    };
    loadStates();
  }, []);

  // Carregar cidades quando estado muda
  useEffect(() => {
    if (formData.state) {
      const loadCities = async () => {
        setLoadingCities(true);
        const stateObj = states.find((s) => s.id.toString() === formData.state);
        if (stateObj) {
          const citiesData = await fetchCities(stateObj.id);
          setCities(citiesData);
        }
        setLoadingCities(false);
      };
      loadCities();

      // Limpar cidade ao trocar estado
      handleChange("city", "");
    }
  }, [formData.state, states, handleChange]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange("state", e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange("city", e.target.value);
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("fullName", e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("email", e.target.value);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPF(e.target.value);
    handleChange("cpf", masked);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    handleChange("phone", masked);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("password", e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChange("confirmPassword", e.target.value);
  };

  const getPasswordStrength = () => {
    const validation = validatePassword(formData.password);
    return validation.strength;
  };

  const getPasswordRequirements = () => {
    return {
      minLength: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      special: /[!@#$%&*()_+\-=]/.test(formData.password),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simular envio para API
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

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 via-white to-slate-100 min-h-screen py-12 px-4">
      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium z-40"
      >
        <i className="ti ti-arrow-left text-lg" aria-hidden="true" />
        Voltar
      </button>

      <div className="w-full max-w-2xl mx-auto mt-8">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#0F2A4A] to-[#1A3D6B] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i
              className="ti ti-user-plus text-white text-2xl"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F2A4A] mb-2">
            Criar Conta
          </h1>
          <p className="text-slate-500 text-sm">
            Preencha os dados abaixo para registrar-se na plataforma
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                Nome Completo
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleFullNameChange}
                onBlur={() => handleBlur("fullName")}
                placeholder="Seu nome e sobrenome"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.fullName && errors.fullName
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
                aria-invalid={touched.fullName && !!errors.fullName}
                aria-describedby={
                  touched.fullName && errors.fullName
                    ? "fullName-error"
                    : undefined
                }
              />
              {touched.fullName && errors.fullName && (
                <p
                  id="fullName-error"
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                E-mail
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                placeholder="seu@email.com"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.email && errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={
                  touched.email && errors.email ? "email-error" : undefined
                }
              />
              {touched.email && errors.email && (
                <p
                  id="email-error"
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* CPF */}
            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                CPF
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={handleCPFChange}
                onBlur={() => handleBlur("cpf")}
                placeholder="000.000.000-00"
                maxLength={14}
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.cpf && errors.cpf
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
                aria-invalid={touched.cpf && !!errors.cpf}
                aria-describedby={
                  touched.cpf && errors.cpf ? "cpf-error" : undefined
                }
              />
              {touched.cpf && errors.cpf && (
                <p
                  id="cpf-error"
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.cpf}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                Celular / WhatsApp
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur("phone")}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.phone && errors.phone
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
                aria-invalid={touched.phone && !!errors.phone}
                aria-describedby={
                  touched.phone && errors.phone ? "phone-error" : undefined
                }
              />
              {touched.phone && errors.phone && (
                <p
                  id="phone-error"
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* STATE AND CITY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STATE */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-bold text-slate-800 mb-2"
                >
                  Estado
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  onBlur={() => handleBlur("state")}
                  className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer ${
                    touched.state && errors.state
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-400"
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                  aria-invalid={touched.state && !!errors.state}
                  aria-describedby={
                    touched.state && errors.state ? "state-error" : undefined
                  }
                >
                  <option value="">Selecione um estado</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name} ({state.sigla})
                    </option>
                  ))}
                </select>
                {touched.state && errors.state && (
                  <p
                    id="state-error"
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <i className="ti ti-alert-circle" aria-hidden="true" />
                    {errors.state}
                  </p>
                )}
              </div>

              {/* CITY */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-bold text-slate-800 mb-2"
                >
                  Cidade
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  onBlur={() => handleBlur("city")}
                  disabled={!formData.state || loadingCities}
                  className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white transition-all appearance-none cursor-pointer ${
                    touched.city && errors.city
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-400"
                  } ${
                    !formData.state || loadingCities
                      ? "opacity-50 cursor-not-allowed bg-slate-100"
                      : ""
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
                  aria-invalid={touched.city && !!errors.city}
                  aria-describedby={
                    touched.city && errors.city ? "city-error" : undefined
                  }
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
                  <p
                    id="city-error"
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <i className="ti ti-alert-circle" aria-hidden="true" />
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                Senha
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.password && errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
                aria-invalid={touched.password && !!errors.password}
                aria-describedby={
                  touched.password && errors.password
                    ? "password-error"
                    : undefined
                }
              />

              {/* PASSWORD STRENGTH INDICATOR */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength === "weak"
                            ? index === 0
                              ? "bg-red-500"
                              : "bg-slate-200"
                            : passwordStrength === "medium"
                              ? index <= 1
                                ? "bg-yellow-500"
                                : "bg-slate-200"
                              : "bg-green-500"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      passwordStrength === "weak"
                        ? "text-red-500"
                        : passwordStrength === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  >
                    Força:{" "}
                    {passwordStrength === "weak"
                      ? "Fraca"
                      : passwordStrength === "medium"
                        ? "Média"
                        : "Forte"}
                  </p>

                  {/* REQUIREMENTS */}
                  <div className="space-y-1 mt-3 text-xs">
                    {[
                      {
                        check: requirements.minLength,
                        label: "Mínimo 8 caracteres",
                      },
                      {
                        check: requirements.uppercase,
                        label: "Pelo menos 1 letra maiúscula (A-Z)",
                      },
                      {
                        check: requirements.lowercase,
                        label: "Pelo menos 1 letra minúscula (a-z)",
                      },
                      {
                        check: requirements.number,
                        label: "Pelo menos 1 número (0-9)",
                      },
                      {
                        check: requirements.special,
                        label:
                          "Pelo menos 1 caractere especial (!@#$%&*()_+=-)",
                      },
                    ].map((requirement, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 ${
                          requirement.check
                            ? "text-green-600"
                            : "text-slate-400"
                        }`}
                      >
                        <i
                          className={`ti text-sm ${
                            requirement.check ? "ti-check" : "ti-circle"
                          }`}
                          aria-hidden="true"
                        />
                        {requirement.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {touched.password && errors.password && (
                <p
                  id="password-error"
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                Confirmar Senha
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border-2 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                }`}
                aria-invalid={
                  touched.confirmPassword && !!errors.confirmPassword
                }
                aria-describedby={
                  touched.confirmPassword && errors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <i className="ti ti-alert-circle" aria-hidden="true" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
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

          {/* TERMS */}
          <div className="text-center text-xs text-slate-500 mt-6">
            <p>
              Ao se registrar, você concorda com nossos{" "}
              <button className="text-[#2E7BD4] hover:underline font-medium">
                Termos de Uso
              </button>{" "}
              e{" "}
              <button className="text-[#2E7BD4] hover:underline font-medium">
                Política de Privacidade
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <i
                  className="ti ti-check text-3xl text-green-600"
                  aria-hidden="true"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0F2A4A] text-center mb-2">
              Tudo certo!
            </h2>
            <p className="text-slate-600 text-center text-sm mb-6">
              Seu cadastro foi realizado com sucesso. Você será redirecionado
              para o login.
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
