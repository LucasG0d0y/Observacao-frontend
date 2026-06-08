/**
 * Hook para gerenciar validação e estado do formulário
 */

import { useState, useCallback } from "react";
import {
  validateFullName,
  validateEmail,
  validateCPF,
  validatePhone,
  validatePassword,
  validatePasswordMatch,
} from "../utils/validators";

export interface FormErrors {
  fullName?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  state?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
}

export interface FormData {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export const useFormValidation = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    cpf: "",
    phone: "",
    state: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback(
    (field: keyof FormData, value: string) => {
      const newErrors = { ...errors };
      delete newErrors[field];

      switch (field) {
        case "fullName":
          if (!validateFullName(value)) {
            newErrors.fullName = "Digite seu nome completo corretamente.";
          }
          break;
        case "email":
          if (!validateEmail(value)) {
            newErrors.email = "Informe um endereço de e-mail válido.";
          }
          break;
        case "cpf":
          if (!validateCPF(value)) {
            newErrors.cpf = "Informe um CPF válido.";
          }
          break;
        case "phone":
          if (!validatePhone(value)) {
            newErrors.phone = "Informe um número de celular válido.";
          }
          break;
        case "state":
          if (!value) {
            newErrors.state = "Selecione um estado.";
          }
          break;
        case "city":
          if (!value) {
            newErrors.city = "Selecione sua cidade.";
          }
          break;
        case "password": {
          const validation = validatePassword(value);
          if (!validation.isValid) {
            newErrors.password =
              "Sua senha deve atender aos requisitos de segurança.";
          }
          break;
        }
        case "confirmPassword":
          if (!validatePasswordMatch(formData.password, value)) {
            newErrors.confirmPassword = "As senhas não coincidem.";
          }
          break;
      }

      setErrors(newErrors);
    },
    [errors, formData.password],
  );

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        validateField(field, value);
      }
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    (field: keyof FormData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, formData[field]);
    },
    [formData, validateField],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!validateFullName(formData.fullName)) {
      newErrors.fullName = "Digite seu nome completo corretamente.";
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = "Informe um endereço de e-mail válido.";
    }
    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "Informe um CPF válido.";
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Informe um número de celular válido.";
    }
    if (!formData.state) {
      newErrors.state = "Selecione um estado.";
    }
    if (!formData.city) {
      newErrors.city = "Selecione sua cidade.";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password =
        "Sua senha deve atender aos requisitos de segurança.";
    }

    if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(formData).every((value) => value.trim() !== "");

  const resetForm = useCallback(() => {
    setFormData({
      fullName: "",
      email: "",
      cpf: "",
      phone: "",
      state: "",
      city: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    isFormValid,
    resetForm,
  };
};
