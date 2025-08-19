'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function UserSettingsForm() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    language: 'es',
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings save logic
    console.log('Saving settings:', settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de la Cuenta</CardTitle>
          <CardDescription>
            Personaliza cómo se comporta la aplicación según tus preferencias.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Apariencia</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Tema</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => handleChange('theme', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona un tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="language">Idioma</Label>
              <Select 
                value={settings.language}
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-medium">Notificaciones</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificaciones del sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones de la aplicación
                </p>
              </div>
              <Switch 
                id="notifications" 
                checked={settings.notifications}
                onCheckedChange={(checked) => handleChange('notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificaciones por correo</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones por correo electrónico
                </p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  );
}
