"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

const initialForm = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  fechaNacimiento: "",
  generoId: "",
  correo: "",
  telefono: "",
  curp: "",
  calle: "",
  numeroExterior: "",
  numeroInterior: "",
  codigoPostalId: "",
  campusId: 1,
  planEstudiosId: 3,
  aspiranteStatusId: 1,
  medioContactoId: 1,
  notas: "",
  atendidoPorUsuarioId: "",
  horarioId: "",
  estadoId: "",
  municipioId: "",
  asentamientoId: "",
};

export default function NuevoAspirantePage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [generos, setGeneros] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [aspiranteStatus, setAspiranteStatus] = useState([]);
  const [mediosContacto, setMediosContacto] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [asentamientos, setAsentamientos] = useState([]);

  useEffect(() => {
    apiFetch("/api/Catalogos/generos").then(setGeneros);
    apiFetch("/api/Catalogos/horarios").then(setHorarios);
    apiFetch("/api/Catalogos/aspirante-status").then(setAspiranteStatus);
    apiFetch("/api/Catalogos/medios-contacto").then(setMediosContacto);
    apiFetch("/api/Catalogos/turnos").then(setTurnos);
    apiFetch("/api/Ubicacion/estados").then(setEstados);
  }, []);

  useEffect(() => {
    if (form.estadoId) {
      apiFetch(`/api/Ubicacion/municipios/${form.estadoId}`).then(setMunicipios);
    }
  }, [form.estadoId]);

  useEffect(() => {
    if (form.municipioId) {
      apiFetch(`/api/Ubicacion/asentamientos/${form.municipioId}`).then((res) => {
        // Si la respuesta es un array, lo asigna directamente
        setAsentamientos(Array.isArray(res) ? res : []);
      });
    }
  }, [form.municipioId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Prepara el payload con los tipos y nombres correctos
    const payload = {
      nombre: form.nombre,
      apellidoPaterno: form.apellidoPaterno,
      apellidoMaterno: form.apellidoMaterno,
      fechaNacimiento: form.fechaNacimiento,
      generoId: Number(form.generoId),
      correo: form.correo,
      telefono: form.telefono,
      curp: form.curp,
      calle: form.calle,
      numeroExterior: form.numeroExterior,
      numeroInterior: form.numeroInterior ? form.numeroInterior : null,
      codigoPostalId: Number(form.codigoPostalId),
      campusId: 1,
      planEstudiosId: 3,
      aspiranteStatusId: 1,
      medioContactoId: Number(form.medioContactoId),
      notas: form.notas,
      atendidoPorUsuarioId: form.atendidoPorUsuarioId ? form.atendidoPorUsuarioId : null,
      horarioId: 1,
    };
      try {
      await apiFetch("/api/Aspirante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // Puedes mostrar un error si lo deseas
      console.error("Error al crear aspirante:", e);
      router.push("/dashboard/list/admissions");
    }

  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Crear Nuevo Aspirante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="apellidoPaterno" placeholder="Apellido Paterno" value={form.apellidoPaterno} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="apellidoMaterno" placeholder="Apellido Materno" value={form.apellidoMaterno} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required className="w-full p-2 border rounded" />
        <select name="generoId" value={form.generoId} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Selecciona Género</option>
          {generos.map((g: any) => (
            <option key={g.idGenero} value={g.idGenero}>{g.descGenero}</option>
          ))}
        </select>
        <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="curp" placeholder="CURP" value={form.curp} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="calle" placeholder="Calle" value={form.calle} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="numeroExterior" placeholder="Número Exterior" value={form.numeroExterior} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="numeroInterior" placeholder="Número Interior" value={form.numeroInterior ?? ""} onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="estadoId" value={form.estadoId} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecciona Estado</option>
          {estados.map((e: any) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select name="municipioId" value={form.municipioId} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecciona Municipio</option>
          {municipios.map((m: any) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <select name="asentamientoId" value={form.asentamientoId} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecciona Asentamiento</option>
          {asentamientos.map((a: any) => (
            <option key={a.id} value={a.id}>{a.asentamiento}</option>
          ))}
        </select>
        <input name="codigoPostalId" placeholder="Código Postal" value={form.codigoPostalId} onChange={handleChange} required className="w-full p-2 border rounded" />
        <select name="planEstudiosId" value={form.planEstudiosId} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Selecciona Plan de Estudios</option>
          {/* Puedes llenar este combo con tu API si tienes los planes */}
          <option value={2}>Plan 2</option>
          <option value={3}>Plan 3</option>
        </select>
        <select name="horarioId" value={form.horarioId} onChange={handleChange} required className="w-full p-2 border rounded">
          <option value="">Selecciona Horario</option>
          {horarios.map((h: any) => <option key={h.id} value={h.id}>{h.nombre}</option>)}
        </select>
        <select name="aspiranteStatusId" value={form.aspiranteStatusId} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecciona Estatus</option>
          {aspiranteStatus.map((s: any) => (
            <option key={s.idAspiranteEstatus} value={s.idAspiranteEstatus}>{s.descEstatus}</option>
          ))}
        </select>
        <select name="medioContactoId" value={form.medioContactoId} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecciona Medio de Contacto</option>
          {mediosContacto.map((m: any) => (
            <option key={m.idMedioContacto} value={m.idMedioContacto}>{m.descMedio}</option>
          ))}
        </select>
        <select name="turnoId" value={form.turnoId} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Selecciona Turno</option>
          {turnos.map((t: any) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
        <input name="notas" placeholder="Notas" value={form.notas} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="btn btn-primary w-full mt-4">Crear Aspirante</button>
      </form>
    </div>
  );
}
