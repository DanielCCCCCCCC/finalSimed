import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { supabase } from "../supabaseClient";
import { parseISO, format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { useAuthStore } from "./auth";
import { Notify } from "quasar";

export const useFichaIdentificacionStore = defineStore(
  "fichaIdentificacion",
  () => {
    const formIdentificacion = ref([]);
    const authStore = useAuthStore();

    const tenant_id = computed(() => authStore?.tenant_id);
    const userId = computed(() => authStore?.userId);

    const cargarDatos = async () => {
      if (!tenant_id.value) {
        return;
      }

      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .select("*")
        .eq("userId", authStore.userId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar los datos de identificación:", error);
        Notify.create({
          message: `Error al cargar los datos: ${error.message}`,
          color: "negative",
          position: "top-right",
        });
      } else {
        // Dado que no se está modificando el nombre de las columnas, podemos asignar data directamente
        formIdentificacion.value = data || [];
      }
    };
    const cargarDatosPorDoctor = async (organizationId, doctorId) => {
      if (!organizationId || !doctorId) {
        console.warn("Faltan organizationId o doctorId");
        return;
      }

      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .select("userId, nombres, dni")
        .eq("tenant_id", organizationId)
        .eq("userId", doctorId) // Asegúrate de que el campo en la base de datos es 'medicoId'
        .order("created_at", { ascending: true });

      if (error) {
        console.error(
          "Error al cargar los datos de identificación por doctor:",
          error
        );
        Notify.create({
          message: `Error al cargar los datos: ${error.message}`,
          color: "negative",
          position: "top-right",
        });
      } else {
        formIdentificacion.value = data || [];
      }
    };
    // NUEVO MÉTODO para buscar nombre real dado el ID
    function getPatientNameById(patientId) {
      const paciente = formIdentificacion.value.find((p) => p.id == patientId);
      if (!paciente) return "Desconocido";
      return paciente.nombres;
    }
    const guardarDatos = async (nuevoFormulario) => {
      if (!tenant_id.value) {
        console.warn("No hay tenant_id disponible");
        return;
      }

      // if (authStore.role?.toLowerCase() !== "admin") {
      //   console.error("El usuario no tiene permisos para agregar pacientes.");
      //   return;
      // }

      if (!tenant_id.value || !userId.value) {
        console.error("No se ha proporcionado un tenant_id o userId válido.");
        Notify.create({
          message: "No se ha proporcionado un tenant_id o userId válido.",
          color: "negative",
          position: "top-right",
        });
        return null;
      }

      const fechaRegistro = new Date().toISOString();
      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .insert([
          {
            ...nuevoFormulario,
            fechaRegistro,
            tenant_id: tenant_id.value,
            userId: userId.value,
          },
        ])
        .select();

      if (error) {
        console.error("Error al guardar los datos de identificación:", error);

        return null;
      } else {
        formIdentificacion.value.push(data[0]);

        return data;
      }
    };
    /**
     * Busca un paciente por su DNI.
     * @param {string} dni - El DNI del paciente a buscar.
     * @returns {Object|null} - Los datos del paciente si existe, o null si no se encuentra.
     */
    const buscarPacientePorDni = async (dni) => {
      if (!tenant_id.value) {
        console.warn("No hay tenant_id disponible");
        return null;
      }

      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .select("*")
        .eq("dni", dni)
        .eq("userId", userId.value) // Añadido el filtro de userId
        .eq("tenant_id", tenant_id.value)
        .single(); // Asume que el DNI es único

      if (error) {
        if (error.code === "PGRST116") {
          // No se encontró el registro
          return null;
        }
        console.error("Error al buscar paciente por DNI:", error);
        Notify.create({
          message: `Error al buscar paciente: ${error.message}`,
          color: "negative",
          position: "top-right",
        });
        return null;
      }

      return data; // { nombres: "Nombre del Paciente", email: "email@ejemplo.com" }
    };
    const actualizarPaciente = async (pacienteActualizado) => {
      if (!tenant_id.value) {
        console.warn("No hay tenant_id disponible");
        return false;
      }

      if (
        !["admin", "medico", "secretaria"].includes(
          authStore.role?.toLowerCase()
        )
      ) {
        console.error(
          "El usuario no tiene permisos para actualizar pacientes."
        );
        return false;
      }

      if (!pacienteActualizado.id) {
        console.error("Error: el ID del paciente es indefinido.");
        Notify.create({
          message: "Error: el ID del paciente es indefinido.",
          color: "negative",
          position: "top-right",
        });
        return false;
      }

      try {
        const { data, error } = await supabase
          .from("fichaIdentificacion")
          .update({
            fechaRegistro: pacienteActualizado.fechaRegistro,
            codigo: pacienteActualizado.codigo,
            activo: pacienteActualizado.activo,
            tipoId: pacienteActualizado.tipoId,
            medicoId: pacienteActualizado.medicoId,
            dni: pacienteActualizado.dni,
            nombres: pacienteActualizado.nombres,
            apellidos: pacienteActualizado.apellidos,
            fechaNacimiento: pacienteActualizado.fechaNacimiento,
            sexo: pacienteActualizado.sexo,
            estadoCivilId: pacienteActualizado.estadoCivilId,
            observaciones: pacienteActualizado.observaciones,
            direccion: pacienteActualizado.direccion,
            telCasa: pacienteActualizado.telCasa,
            telPersonal: pacienteActualizado.telPersonal,
            email: pacienteActualizado.email,
            departamentoId: pacienteActualizado.departamentoId,
            municipioId: pacienteActualizado.municipioId,
            organizacion: pacienteActualizado.organizacion,
            conyugue: pacienteActualizado.conyugue,
            madre: pacienteActualizado.madre,
            padre: pacienteActualizado.padre,
            escolaridadId: pacienteActualizado.escolaridadId,
            ocupacion: pacienteActualizado.ocupacion,
            grupoSanguineoId: pacienteActualizado.grupoSanguineoId,
            alergias: pacienteActualizado.alergias,
            referidoPorId: pacienteActualizado.referidoPorId,
            medicoCabecera: pacienteActualizado.medicoCabecera, // Ajustado el campo según el schema
            vih: pacienteActualizado.vih, // Asegúrate de guardar también este campo
          })
          .eq("id", pacienteActualizado.id)
          .eq("tenant_id", tenant_id.value)
          .select();

        if (error) {
          console.error("Error al actualizar paciente:", error.message);
          Notify.create({
            message: `Error al actualizar el paciente: ${error.message}`,
            color: "negative",
            position: "top-right",
          });
          return false;
        } else if (data && data.length > 0) {
          const index = formIdentificacion.value.findIndex(
            (p) => p.id === pacienteActualizado.id
          );
          if (index !== -1) {
            formIdentificacion.value[index] = data[0];
          }
          Notify.create({
            message: "Paciente actualizado exitosamente",
            color: "positive",
            position: "top-right",
          });
          return true;
        } else {
          console.warn(
            "Actualización fallida: No se encontraron registros con el ID proporcionado."
          );
          Notify.create({
            message:
              "Actualización fallida: No se encontraron registros con el ID proporcionado.",
            color: "warning",
            position: "top-right",
          });
          return false;
        }
      } catch (error) {
        console.error("Error al conectar con Supabase:", error);
        Notify.create({
          message: `Error al conectar con Supabase: ${error.message}`,
          color: "negative",
          position: "top-right",
        });
        return false;
      }
    };

    const eliminarPaciente = async (id) => {
      if (!tenant_id.value) {
        console.warn("No hay tenant_id disponible");
        return false;
      }

      if (authStore.role?.toLowerCase() !== "admin") {
        console.error("El usuario no tiene permisos para eliminar pacientes.");
        return false;
      }

      const { error } = await supabase
        .from("fichaIdentificacion")
        .delete()
        .eq("id", id)
        .eq("tenant_id", tenant_id.value);

      if (error) {
        console.error("Error al eliminar el paciente:", error);
        Notify.create({
          message: `Error al eliminar el paciente: ${error.message}`,
          color: "negative",
          position: "top-right",
        });
        return false;
      } else {
        formIdentificacion.value = formIdentificacion.value.filter(
          (p) => p.id !== id
        );
        Notify.create({
          message: "Paciente eliminado exitosamente",
          color: "positive",
          position: "top-right",
        });
        return true;
      }
    };

    // Computed para registros por día de la semana
    const registrosPorDia = computed(() => {
      const inicioMes = startOfMonth(new Date());
      const finMes = endOfMonth(new Date());

      const conteoPorDia = {
        lunes: 0,
        martes: 0,
        miércoles: 0,
        jueves: 0,
        viernes: 0,
        sábado: 0,
        domingo: 0,
      };

      formIdentificacion.value
        .filter((paciente) => {
          const fechaRegistro = parseISO(paciente.fechaRegistro);
          return fechaRegistro >= inicioMes && fechaRegistro <= finMes;
        })
        .forEach((paciente) => {
          const fechaRegistro = parseISO(paciente.fechaRegistro);
          const diaSemana = format(fechaRegistro, "EEEE", { locale: es });
          const diaClave = diaSemana.toLowerCase();
          if (conteoPorDia.hasOwnProperty(diaClave)) {
            conteoPorDia[diaClave] += 1;
          }
        });

      return Object.entries(conteoPorDia).map(([day, registros]) => ({
        day,
        registros,
      }));
    });

    const totalActivos = computed(
      () => formIdentificacion.value.filter((p) => p.activo).length
    );
    const totalInactivos = computed(
      () => formIdentificacion.value.filter((p) => !p.activo).length
    );

    const dataGraficoPacientes = computed(() => [
      { estado: "Activos", cantidad: totalActivos.value },
      { estado: "Inactivos", cantidad: totalInactivos.value },
    ]);

    // watch(
    //   tenant_id,
    //   (newTenantId) => {
    //     if (newTenantId) {
    //       cargarDatos();
    //     } else {
    //       formIdentificacion.value = [];
    //     }
    //   },
    //   { immediate: true }
    // );
    watch(
      [tenant_id, userId],
      ([newTenantId, newUserId]) => {
        if (newTenantId && newUserId) {
          cargarDatos();
        } else {
          formIdentificacion.value = [];
        }
      },
      { immediate: true }
    );

    return {
      formIdentificacion,
      cargarDatos,
      cargarDatosPorDoctor, // Añadir este método
      getPatientNameById,
      guardarDatos,
      actualizarPaciente,
      eliminarPaciente,
      registrosPorDia,
      totalActivos,
      totalInactivos,
      dataGraficoPacientes,
      buscarPacientePorDni, // Exponer la nueva función
    };
  }
);
