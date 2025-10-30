import { useCallback, useState } from 'react';
import {
  ContactFormData,
  ContactSubmission,
  VehicleRequestFormData,
  VehicleRequestWithFiles,
  contactService,
} from '../lib/services/contactService';
import { useApi } from './useApi';

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitContact = useCallback(async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await contactService.submitContactForm(data);

      if (response.success) {
        setSubmitSuccess(true);
        return response.data;
      } else {
        throw new Error(
          response.message || "Erreur lors de l'envoi du formulaire"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur est survenue';
      setSubmitError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const submitVehicleRequest = useCallback(
    async (data: VehicleRequestFormData) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const response = await contactService.submitVehicleRequest(data);

        if (response.success) {
          setSubmitSuccess(true);
          return response.data;
        } else {
          throw new Error(
            response.message || "Erreur lors de l'envoi de la demande"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Une erreur est survenue';
        setSubmitError(errorMessage);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const submitVehicleRequestWithFiles = useCallback(
    async (data: VehicleRequestWithFiles) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const response =
          await contactService.submitVehicleRequestWithFiles(data);

        if (response.success) {
          setSubmitSuccess(true);
          return response.data;
        } else {
          throw new Error(
            response.message || "Erreur lors de l'envoi de la demande"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Une erreur est survenue';
        setSubmitError(errorMessage);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  }, []);

  return {
    submitContact,
    submitVehicleRequest,
    submitVehicleRequestWithFiles,
    isSubmitting,
    submitError,
    submitSuccess,
    reset,
  };
}

export function useContactSubmissions() {
  return useApi<ContactSubmission[]>(
    () => contactService.getContactSubmissions(),
    {
      immediate: true,
      refetchOnMount: true,
      cacheTime: 5 * 60 * 1000, // 5 minutes
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
}

export function useContactSubmission(id: string) {
  return useApi<ContactSubmission>(
    () => contactService.getContactSubmissionById(id),
    {
      immediate: !!id,
      refetchOnMount: true,
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}

export function useContactStats() {
  return useApi<{
    totalSubmissions: number;
    pendingSubmissions: number;
    completedSubmissions: number;
    averageResponseTime: number;
    submissionsByType: Array<{ type: string; count: number }>;
  }>(() => contactService.getContactStats(), {
    immediate: true,
    refetchOnMount: true,
    cacheTime: 15 * 60 * 1000, // 15 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export default {
  useContactForm,
  useContactSubmissions,
  useContactSubmission,
  useContactStats,
};
