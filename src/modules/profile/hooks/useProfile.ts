import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileService } from '../services/profile.service';
import { UserProfile, ProfileFormValues } from '../types';
import { profileFormSchema, ProfileFormData } from '../schemas/profile.schema';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await profileService.getProfile();
        setProfile(userProfile);
        
        // Set form values
        const { id, role, createdAt, updatedAt, ...formValues } = userProfile;
        form.reset(formValues);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [form]);

  const updateProfile = async (data: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'No se pudo actualizar el perfil' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profile,
    isLoading,
    isSubmitting,
    form,
    updateProfile,
  };
}
