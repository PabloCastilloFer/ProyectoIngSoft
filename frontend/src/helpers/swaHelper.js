import Swal from 'sweetalert2';
const Toast = Swal.mixin({
    toast: true,
    position: "top end",
    showConfirButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
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
        title: "Tarea actualizada exitosamente!"
    })
};

export const showNotFoundTarea = async () => {
    await Toast.fire({
        icon: "info",
        title: "Tarea no encontrada"
    })
};

export const showFoundTarea = async () => {
    await Toast.fire({
        icon: "info",
        title: "Tarea encontrada"
    })
};