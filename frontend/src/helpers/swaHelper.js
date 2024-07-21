import Swal from 'sweetalert2';
const Toast = Swal.mixin({
    toast: true,
    position: "center",
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

export const showErrorFormTarea = async () => {
    await Toast.fire({
        icon: "error",
        title: "Error al crear la tarea"
    });
};

export const showError = async () => {
    await Toast.fire({
        icon: "info",
        title: error
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
    })
};

export const showNotFoundTarea = async () => {
    await Toast.fire({
        icon: "info",
        title: "Tarea no encontrada"
    })
};

export const showNoSePuedeEditar = async () => {
    await Toast.fire({
        icon: "info",
        title: "No se puede editar la tarea con ese estado"
    })
};

export const showFoundTarea = async () => {
  await Toast.fire({
      icon: "info",
      title: "Tarea encontrada"
  })
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
        text: "La tarea ha sido cread",
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
      text: "Se borrara la información ingresada.",
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