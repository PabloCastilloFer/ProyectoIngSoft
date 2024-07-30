// swaHelper.js
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: "bottom-start",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const showConfirmFormTarea = async () => {
    await Toast.fire({
        icon: "success",
        title: "Tarea creada exitosamente!"
    });
};

export const showConfirmFormTareaDuplicar = async () => {
  await Toast.fire({
      icon: "success",
      title: "Tarea duplicada exitosamente!"
  });
};

export const showErrorFormTarea = async (message) => {
    await Toast.fire({
        icon: "error",
        title: message || "Error al crear la tarea"
    });
};

export const showError = async (message) => {
    await Toast.fire({
        icon: "info",
        title: message || "Ha ocurrido un error"
    });
};

export const showDeleteTarea = async () => {
    await Toast.fire({
        icon: "success",
        title: "Tarea eliminada exitosamente!"
    });
};

export const showUpdateTarea = async () => {
    await Toast.fire({
        icon: "success",
        title: "Tarea modificada exitosamente!"
    });
};

export const showNotFoundTarea = async () => {
    await Toast.fire({
        icon: "info",
        title: "Tarea no encontrada"
    });
};

export const showAsignadaEliminada = async () => {
  await Toast.fire({
      icon: "info",
      title: "No se puede eliminar una tarea asignada"
  });
};

export const showNoAsignada = async () => {
    await Toast.fire({
        icon: "info",
        title: "No se puede editar una tarea asignada"
    });
};

export const showNoEntregada = async () => {
    await Toast.fire({
        icon: "info",
        title: "No se puede editar una tarea entregada"
    });
};

export const showNoEntregadaEliminada = async () => {
  await Toast.fire({
      icon: "info",
      title: "No se puede eliminar una tarea entregada"
  });
};

export const showRevisadaEliminada = async () => {
  await Toast.fire({
      icon: "info",
      title: "No se puede eliminar una tarea revisada"
  });
};

export const showNoRevisada = async () => {
    await Toast.fire({
        icon: "info",
        title: "No se puede editar una tarea revisada"
    });
};

export const showNoEnRevision = async () => {
    await Toast.fire({
        icon: "info",
        title: "No se puede editar una tarea en revisión"
    });
};

export const showRevisionEliminada = async () => {
  await Toast.fire({
      icon: "info",
      title: "No se puede eliminar una tarea en revisión"
  });
};

export const showFoundTarea = async () => {
    await Toast.fire({
        icon: "info",
        title: "Tarea encontrada"
    });
};

export const DeleteQuestion = async () => {
    const result = await Swal.fire({
        title: "¿Estás seguro de eliminar la tarea?",
        text: "Estos cambios son irreversibles.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        },
        buttonsStyling: false,
    });

    if (result.isConfirmed) {
        await Swal.fire({
            title: "Eliminado Correctamente!",
            text: "La tarea ha sido eliminada",
            icon: "success"
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire({
            title: "Cancelado",
            text: "Tu tarea está a salvo",
            icon: "success"
        });
    }

    return result.isConfirmed;
};

export const UpdateQuestion = async () => {
    const result = await Swal.fire({
        title: "¿Estás seguro de modificar la tarea?",
        text: "Estos cambios son irreversibles.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, modificar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        },
        buttonsStyling: false,
    });

    if (result.isConfirmed) {
        await Swal.fire({
            title: "Tarea modificada correctamente!",
            text: "La tarea ha sido modificada",
            icon: "success"
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire({
            title: "Cancelado",
            text: "Tu tarea no ha sido modificada",
            icon: "success"
        });
    }

    return result.isConfirmed;
};

export const CreateQuestion = async () => {
    const result = await Swal.fire({
        title: "¿Estas seguro de los datos ingresados?",
        text: "Estos cambios son irreversibles.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, crear",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        },
        buttonsStyling: false,
    });

    if (result.isConfirmed) {
        await Swal.fire({
            title: "Tarea creada correctamente!",
            text: "La tarea ha sido creada",
            icon: "success"
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire({
            title: "Cancelado",
            text: "Tu tarea no ha sido creada",
            icon: "success"
        });
    }

    return result.isConfirmed;
};

export const VolverQuestion = async () => {
    const result = await Swal.fire({
        title: "¿Estas seguro de regresar de página?",
        text: "Se borrará toda la información no guardada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, volver",
        cancelButtonText: "No, quedarme",
        reverseButtons: true,
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        },
        buttonsStyling: false,
    });

    return result.isConfirmed;
};

export const UpdatedTicket = async () => {
    const result = await Swal.fire({
        title: "¿Estás seguro de modificar la tarea?",
        text: "Estos cambios son irreversibles.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, modificar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        },
        buttonsStyling: false,
    });

    if (result.isConfirmed) {
        await Swal.fire({
            title: "Tarea modificada correctamente!",
            text: "La tarea ha sido modificada",
            icon: "success"
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire({
            title: "Cancelado",
            text: "Tu tarea no ha sido modificada",
            icon: "success"
        });
    }

    return result.isConfirmed;
};

export const CreatedTicket = async () => {
    const result = await Swal.fire({
        title: "¿Estas seguro de los datos ingresados?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, asignar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        customClass: {
            confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
            cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        },
        buttonsStyling: false,
    });

    if (result.isConfirmed) {
        await Swal.fire({
            title: "Asignado correctamente!",
            icon: "success"
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire({
            title: "Cancelado",
            text: "Tu tarea no ha sido asignada",
            icon: "success"
        });
    }

    return result.isConfirmed;
};

export const showConfirmFormTicket = async () => {
    await Toast.fire({
        icon: "success",
        title: "Asignacion exitosa!"
    });
};

export const showErrorFormTicket = async () => {
    await Toast.fire({
        icon: "error",
        title: "Error al asignar la tarea"
    });
};

export const showDeleteTicket = async () => {
  await Toast.fire({
      icon: "success",
      title: "Tarea desasignada exitosamente!"
  });
}

export const showFechaInicioError = async () => {
  await Toast.fire({
      icon: "error",
      title: "La fecha de inicio debe ser en el futuro"
  });
};

export const showFechaInicioLaboralError = async () => {
  await Toast.fire({
      icon: "error",
      title: "La fecha de inicio debe ser en días laborables y horario de trabajo"
  });
};

export const showFechaFinError = async () => {
  await Toast.fire({
      icon: "error",
      title: "La fecha de fin debe ser después de la fecha de inicio"
  });
};

export const showFechaFinLaboralError = async () => {
  await Toast.fire({
      icon: "error",
      title: "La fecha de fin debe ser en días laborables y horario de trabajo"
  });
};

export const showRutAsignadoError = async () => {
  await Toast.fire({
      icon: "error",
      title: "El RUT asignado es obligatorio"
  });
};

export const showUsernameError = async () => {
  await Toast.fire({
      icon: "error",
      title: "El nombre de usuario es obligatorio"
  });
};

export const showEmailError = async () => {
  await Toast.fire({
      icon: "error",
      title: "El correo electrónico es obligatorio"
  });
};

export const showPasswordError = async () => {
  await Toast.fire({
      icon: "error",
      title: "La contraseña es obligatoria"
  });
};
export const showPasswordLengthError = async () => {
  await Toast.fire({
      icon: "error",
      title: "La contraseña debe tener al menos 5 caracteres."
  });
};

export const showRutError = async () => {
  await Toast.fire({
      icon: "error",
      title: "El RUT es obligatorio"
  });
};
export const showRutDuplicateError = async () => {
  await Toast.fire({
    icon: "error",
    title: "El rut ingresado posee un usuario"
  });
};

export const showRoleError = async () => {
  await Toast.fire({
      icon: "error",
      title: "El rol es obligatorio"
  });
};

export const showFacultyError = async () => {
  await Toast.fire({
      icon: "error",
      title: "La facultad es obligatoria"
  });
};

export const showAuthError = async () => {
  await Toast.fire({
      icon: "error",
      title: "No autorizado"
  });
};

export const showConfirmUserCreated = async () => {
  await Toast.fire({
      icon: "success",
      title: "Usuario creado con éxito"
  });
};


export const DeleteFacultyQuestion = async () => {
  const result = await Swal.fire({
    title: "¿Estás seguro de eliminar esta facultad?",
    text: "Estos cambios son irreversibles.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, cancelar",
    reverseButtons: true,
    customClass: {
      confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
      cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "Eliminado Correctamente!",
      text: "La facultad ha sido eliminada",
      icon: "success"
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    await Swal.fire({
      title: "Cancelado",
      icon: "success"
    });
  }

  return result.isConfirmed;
};
export const showConfirmFacultyCreated = async () => {
  await Toast.fire({
      icon: "success",
      title: "Facultad creada con éxito!"
  });
};

export const DuplicarQuestion = async () => {
  const result = await Swal.fire({
    title: "¿Estás seguro de duplicar la tarea?",
    text: "Estos cambios son irreversibles.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, duplicar",
    cancelButtonText: "No, cancelar",
    reverseButtons: true,
    customClass: {
      confirmButton: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded",
      cancelButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    },
    buttonsStyling: false,
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "Tarea duplicada correctamente!",
      text: "La tarea ha sido duplicada",
      icon: "success"
    });
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    await Swal.fire({
      title: "Cancelado",
      text: "La tarea no ha sido duplicada",
      icon: "success"
    });
  }

  return result.isConfirmed;
};

// Función para mostrar una alerta de éxito
export const showSuccess = async (message) => {
  await Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: message,
    showConfirmButton: true,
    timer: 1500
  });
};

// Función para mostrar una alerta de información
export const showInfo = async (message) => {
  await Swal.fire({
    icon: 'info',
    title: 'Información',
    text: message,
    showConfirmButton: true,
    timer: 1500
  });
};

// Función para mostrar una alerta de advertencia
export const showWarning = async (message) => {
  await Swal.fire({
    icon: 'warning',
    title: 'Advertencia',
    text: message,
    showConfirmButton: true,
    timer: 1500
  });
};

// Función para mostrar una alerta de confirmación antes de eliminar
export const showConfirmDelete = async () => {
  return await Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminarlo'
  });
};

export const showErrorLogin = async () => {
  await Swal.fire({
    icon: "error",
    title: "Error al iniciar sesión",
    text: "Por favor, verifica tus datos y vuelve a intentarlo."
  });
};


export const showErrorComentario = async (message) => {
  await Swal.fire({
    icon: "error",
    title: message,
    confirmButtonColor: '#387ADF'
  });
};

export const showUserNotFoundError = async () => {
  await Swal.fire({
    icon: "error",
    title: "Empleado no encontrado o no tiene rol de empleado",
    confirmButtonColor: '#387ADF'
  });
};

export const showFetchUserError = async () => {
  await Swal.fire({
    icon: "error",
    title: "Error al obtener empleado",
    confirmButtonColor: '#387ADF'
  });
};

export const showGeneralCommentError = async () => {
  await Swal.fire({
    icon: "error",
    title: "Error al agregar comentario",
    confirmButtonColor: '#387ADF'
  });
};
export const showCommentSuccess = async () => {
  await Swal.fire({
    icon: "success",
    title: "Comentario creado con éxito",
    confirmButtonColor: '#387ADF'
  });
};