// import { defineStore } from "pinia";
// import { ref, computed, watch } from "vue";
// import { supabase } from "../supabaseClient";
// import { parseISO, format, startOfMonth, endOfMonth } from "date-fns";
// import { es } from "date-fns/locale";
// import { useAuthStore } from "./auth";

// export const useFichaIdentificacionStore = defineStore(
//   "fichaIdentificacion",
//   () => {
//     const formIdentificacion = ref([]);
//     const authStore = useAuthStore();

//     const tenantId = computed(() => authStore?.tenantId);
//     const userId = computed(() => authStore?.userId);

//     watch([tenantId, userId], ([newTenantId, newUserId]) => {

//       if (!newTenantId) {
//         console.error("No se ha proporcionado un tenantId válido.");
//       }
//       if (!newUserId) {
//         console.error("No se ha proporcionado un userId válido.");
//       }
//     });

//     const cargarDatos = async () => {

//       if (!tenantId.value) {

//         return;
//       }

//       const { data, error } = await supabase
//         .from("fichaIdentificacion")
//         .select("*")
//         .eq("tenantId", tenantId.value)
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error al cargar los datos de identificación:", error);
//       } else {

//         formIdentificacion.value = (data || []).map((paciente) => ({
//           ...paciente,
//           tipoId: Number(paciente.tipoId),
//           medicoId: Number(paciente.medicoId),
//           estadoCivilId: Number(paciente.estadoCivilId),
//           departamentoId: Number(paciente.departamentoId),
//           municipioId: Number(paciente.municipioId),
//           escolaridadId: Number(paciente.escolaridadId),
//           grupoSanguineoId: Number(paciente.grupoSanguineoId),
//         }));
//       }
//     };

//     const guardarDatos = async (nuevoFormulario) => {

//       if (!tenantId.value || !userId.value) {
//         console.error("No se ha proporcionado un tenantId o userId válido.");
//         return null;
//       }

//       const fechaRegistro = new Date().toISOString();
//       const { data, error } = await supabase
//         .from("fichaIdentificacion")
//         .insert([
//           {
//             ...nuevoFormulario,
//             fechaRegistro,
//             tenantId: tenantId.value,
//             userId: userId.value,
//           },
//         ])
//         .select();

//       if (error) {
//         console.error("Error al guardar los datos de identificación:", error);
//         return null;
//       } else {
//         return data;
//       }
//     };

//     const actualizarPaciente = async (pacienteActualizado) => {
//       if (!pacienteActualizado.id) {
//         console.error("Error: el ID del paciente es indefinido.");
//         return false;
//       }
//       if (!tenantId.value) {
//         console.error("No se ha proporcionado un tenantId válido.");
//         return false;
//       }
//       try {

//         const { data, error } = await supabase
//           .from("fichaIdentificacion")
//           .update({
//             fechaRegistro: pacienteActualizado.fechaRegistro,
//             codigo: pacienteActualizado.codigo,
//             activo: pacienteActualizado.activo,
//             tipoId: pacienteActualizado.tipoId,
//             medicoId: pacienteActualizado.medicoId,
//             dni: pacienteActualizado.dni,
//             nombres: pacienteActualizado.nombres,
//             apellidos: pacienteActualizado.apellidos,
//             fechaNacimiento: pacienteActualizado.fechaNacimiento,
//             sexo: pacienteActualizado.sexo,
//             estadoCivilId: pacienteActualizado.estadoCivilId,
//             observaciones: pacienteActualizado.observaciones,
//             direccion: pacienteActualizado.direccion,
//             telCasa: pacienteActualizado.telCasa,
//             telPersonal: pacienteActualizado.telPersonal,
//             email: pacienteActualizado.email,
//             departamentoId: pacienteActualizado.departamentoId,
//             municipioId: pacienteActualizado.municipioId,
//             organizacion: pacienteActualizado.organizacion,
//             conyugue: pacienteActualizado.conyugue,
//             madre: pacienteActualizado.madre,
//             padre: pacienteActualizado.padre,
//             escolaridadId: pacienteActualizado.escolaridadId,
//             ocupacion: pacienteActualizado.ocupacion,
//             grupoSanguineoId: pacienteActualizado.grupoSanguineoId,
//             alergias: pacienteActualizado.alergias,
//           })
//           .eq("id", pacienteActualizado.id)
//           .eq("tenantId", tenantId.value)
//           .select();

//         if (error) {
//           console.error("Error al actualizar paciente:", error.message);
//           return false;
//         } else if (data && data.length > 0) {
//           const index = formIdentificacion.value.findIndex(
//             (p) => p.id === pacienteActualizado.id
//           );
//           if (index !== -1) {
//             formIdentificacion.value[index] = data[0];
//           }
//           return true;
//         } else {
//           console.warn(
//             "Actualización fallida: No se encontraron registros con el id proporcionado."
//           );
//           return false;
//         }
//       } catch (error) {
//         console.error("Error al conectar con Supabase:", error);
//         return false;
//       }
//     };

//     const eliminarPaciente = async (id) => {

//       if (!tenantId.value) {
//         console.error("No se ha proporcionado un tenantId válido.");
//         return false;
//       }

//       const { error } = await supabase
//         .from("fichaIdentificacion")
//         .delete()
//         .eq("id", id)
//         .eq("tenantId", tenantId.value);

//       if (error) {
//         console.error("Error al eliminar el paciente:", error);
//         return false;
//       } else {
//         formIdentificacion.value = formIdentificacion.value.filter(
//           (p) => p.id !== id
//         );
//         return true;
//       }
//     };

//     const registrosPorDia = computed(() => {
//       const inicioMes = startOfMonth(new Date());
//       const finMes = endOfMonth(new Date());

//       const conteoPorDia = {
//         lunes: 0,
//         martes: 0,
//         miércoles: 0,
//         jueves: 0,
//         viernes: 0,
//         sábado: 0,
//         domingo: 0,
//       };

//       formIdentificacion.value
//         .filter((paciente) => {
//           const fechaRegistro = parseISO(paciente.fechaRegistro);
//           return fechaRegistro >= inicioMes && fechaRegistro <= finMes;
//         })
//         .forEach((paciente) => {
//           const fechaRegistro = parseISO(paciente.fechaRegistro);
//           const diaSemana = format(fechaRegistro, "EEEE", { locale: es });
//           const diaClave = diaSemana.toLowerCase();
//           if (conteoPorDia.hasOwnProperty(diaClave)) {
//             conteoPorDia[diaClave] += 1;
//           }
//         });

//       return Object.entries(conteoPorDia).map(([day, registros]) => ({
//         day,
//         registros,
//       }));
//     });

//     const totalActivos = computed(
//       () => formIdentificacion.value.filter((p) => p.activo).length
//     );

//     const totalInactivos = computed(
//       () => formIdentificacion.value.filter((p) => !p.activo).length
//     );

//     const dataGraficoPacientes = computed(() => [
//       { estado: "Activos", cantidad: totalActivos.value },
//       { estado: "Inactivos", cantidad: totalInactivos.value },
//     ]);

//     watch(
//       tenantId,
//       (newTenantId) => {
//         if (newTenantId) {
//           cargarDatos();
//         } else {
//           formIdentificacion.value = [];
//         }
//       },
//       { immediate: true }
//     );

//     return {
//       formIdentificacion,
//       cargarDatos,
//       guardarDatos,
//       actualizarPaciente,
//       eliminarPaciente,
//       registrosPorDia,
//       totalActivos,
//       totalInactivos,
//       dataGraficoPacientes,
//     };
//   }
// );
// fichaIdentificacionStores.js
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { supabase } from "../supabaseClient"; // Asegúrate de tener configurado supabaseClient
import { parseISO, format, startOfMonth, endOfMonth } from "date-fns"; // Asegúrate de importar parseISO
import { es } from "date-fns/locale";
import { useAuthStore } from "./auth"; // Importa el authStore
import { Notify } from "quasar"; // Asegúrate de importar Notify

export const useFichaIdentificacionStore = defineStore(
  "fichaIdentificacion",
  () => {
    const formIdentificacion = ref([]);
    const authStore = useAuthStore();

    // Computed para obtener tenantId y userId reactivamente
    const tenantId = computed(() => authStore?.tenantId);
    const userId = computed(() => authStore?.userId); // Obtener userId desde authStore

    // Verificar que tenantId y userId son válidos
    watch([tenantId, userId], ([newTenantId, newUserId]) => {
      if (!newTenantId) {
        console.error("No se ha proporcionado un tenantId válido.");
      }
      if (!newUserId) {
        console.error("No se ha proporcionado un userId válido.");
      }
    });

    // Función para cargar datos desde Supabase
    const cargarDatos = async () => {
      if (!tenantId.value) {
        return;
      }

      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .select("*")
        .eq("tenantId", tenantId.value)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar los datos de identificación:", error);
        Notify.create({
          message: `Error al cargar los datos: ${error.message}`,
          color: "negative",
          position: "top-right",
        });
      } else {
        formIdentificacion.value = (data || []).map((paciente) => ({
          ...paciente,
          tipoId: paciente.tipoId,
          medicoId: paciente.medicoId,
          estadoCivilId: paciente.estadoCivilId,
          departamentoId: paciente.departamentoId,
          municipioId: paciente.municipioId,
          escolaridadId: paciente.escolaridadId,
          grupoSanguineoId: paciente.grupoSanguineoId,
          medicoCabeceraId: paciente.medicoCabeceraId,
          referidoPorId: paciente.referidoPorId,
        }));
      }
    };

    // Función para guardar un nuevo paciente
    const guardarDatos = async (nuevoFormulario) => {
      if (!tenantId.value || !userId.value) {
        console.error("No se ha proporcionado un tenantId o userId válido.");
        Notify.create({
          message: "No se ha proporcionado un tenantId o userId válido.",
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
            tenantId: tenantId.value,
            userId: userId.value, // Usar userId del authStore
          },
        ])
        .select();

      if (error) {
        console.error("Error al guardar los datos de identificación:", error);
        Notify.create({
          message: `Error al guardar los datos: ${error.message}`,
          color: "negative",
          position: "top-right",
        });
        return null;
      } else {
        // Añadir el nuevo paciente al array
        formIdentificacion.value.push(data[0]);
        Notify.create({
          message: "Datos guardados exitosamente",
          color: "positive",
          position: "top-right",
        });
        return data;
      }
    };

    // Función para actualizar un paciente existente
    const actualizarPaciente = async (pacienteActualizado) => {
      if (!pacienteActualizado.id) {
        console.error("Error: el ID del paciente es indefinido.");
        Notify.create({
          message: "Error: el ID del paciente es indefinido.",
          color: "negative",
          position: "top-right",
        });
        return false;
      }
      if (!tenantId.value) {
        console.error("No se ha proporcionado un tenantId válido.");
        Notify.create({
          message: "No se ha proporcionado un tenantId válido.",
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
            medicoCabeceraId: pacienteActualizado.medicoCabeceraId,
          })
          .eq("id", pacienteActualizado.id)
          .eq("tenantId", tenantId.value) // Asegura que solo actualizas del tenant actual
          .select(); // Seleccionar para obtener el registro actualizado

        if (error) {
          console.error("Error al actualizar paciente:", error.message);
          Notify.create({
            message: `Error al actualizar el paciente: ${error.message}`,
            color: "negative",
            position: "top-right",
          });
          return false;
        } else if (data && data.length > 0) {
          // Actualiza el paciente en la lista localmente
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
            "Actualización fallida: No se encontraron registros con el id proporcionado."
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

    // Función para eliminar un paciente
    const eliminarPaciente = async (id) => {
      if (!tenantId.value) {
        console.error("No se ha proporcionado un tenantId válido.");
        Notify.create({
          message: "No se ha proporcionado un tenantId válido.",
          color: "negative",
          position: "top-right",
        });
        return false;
      }

      const { error } = await supabase
        .from("fichaIdentificacion")
        .delete()
        .eq("id", id)
        .eq("tenantId", tenantId.value); // Asegura que solo eliminas del tenant actual

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
      // Obtén el primer y último día del mes actual
      const inicioMes = startOfMonth(new Date());
      const finMes = endOfMonth(new Date());

      // Inicializa un objeto para almacenar el conteo acumulado por cada día de la semana
      const conteoPorDia = {
        lunes: 0,
        martes: 0,
        miércoles: 0,
        jueves: 0,
        viernes: 0,
        sábado: 0,
        domingo: 0,
      };

      // Filtra los registros dentro del mes actual y agrúpalos por día de la semana
      formIdentificacion.value
        .filter((paciente) => {
          // Asegúrate de que `fechaRegistro` esté en el formato de fecha correcto
          const fechaRegistro = parseISO(paciente.fechaRegistro); // Usa parseISO para convertir la fecha
          return fechaRegistro >= inicioMes && fechaRegistro <= finMes;
        })
        .forEach((paciente) => {
          const fechaRegistro = parseISO(paciente.fechaRegistro); // Usa parseISO para convertir la fecha
          const diaSemana = format(fechaRegistro, "EEEE", { locale: es });
          const diaClave = diaSemana.toLowerCase();
          if (conteoPorDia.hasOwnProperty(diaClave)) {
            conteoPorDia[diaClave] += 1;
          }
        });

      // Convierte el objeto de conteo a un arreglo para usarlo en el gráfico
      return Object.entries(conteoPorDia).map(([day, registros]) => ({
        day,
        registros,
      }));
    });

    // Computed para totales de activos e inactivos
    const totalActivos = computed(
      () => formIdentificacion.value.filter((p) => p.activo).length
    );

    const totalInactivos = computed(
      () => formIdentificacion.value.filter((p) => !p.activo).length
    );

    // Computed para datos del gráfico de pacientes
    const dataGraficoPacientes = computed(() => [
      { estado: "Activos", cantidad: totalActivos.value },
      { estado: "Inactivos", cantidad: totalInactivos.value },
    ]);

    // Watcher para cargar datos cuando cambia el tenantId
    watch(
      tenantId,
      (newTenantId) => {
        if (newTenantId) {
          cargarDatos();
        } else {
          formIdentificacion.value = []; // Limpiar datos si no hay tenantId
        }
      },
      { immediate: true }
    );

    return {
      formIdentificacion,
      cargarDatos,
      guardarDatos,
      actualizarPaciente,
      eliminarPaciente,
      registrosPorDia,
      totalActivos,
      totalInactivos,
      dataGraficoPacientes,
    };
  }
);
