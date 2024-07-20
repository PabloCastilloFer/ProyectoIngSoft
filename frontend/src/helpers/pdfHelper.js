import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const showPDFGeneratedSuccess = async () => {
    await Toast.fire({
        icon: "success",
        title: "PDF generado exitosamente!"
    });
};

export const showPDFGeneratedError = async () => {
    await Toast.fire({
        icon: "error",
        title: "Error al generar el PDF"
    });
};