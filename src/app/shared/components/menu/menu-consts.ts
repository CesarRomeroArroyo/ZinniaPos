export const menuItems = [
    {
        icon: 'person-outline',
        text: 'Editar perfil',
        isArrow: true,
        route: 'user/edit-user'
    },
    {
        icon: 'cash-outline',
        text: 'Suscripciones y pagos',
        isArrow: true,
        route: 'user/payments'
    },
    {
        icon: 'lock-closed-outline',
        text: 'Seguridad',
        isArrow: true,
        route: 'user/security'
    },
    {
        icon: 'shield-checkmark-outline',
        text: 'Politicas de privacidad',
        isArrow: true,
        externalRoute: ''
    },
    {
        icon: 'shield-outline',
        text: 'Acuerdos y condiciones',
        isArrow: true,
        externalRoute: ''
    },
    {
        icon: 'trash-outline',
        text: 'Eliminar mi cuenta',
        isArrow: false,
        daleteAccount: true
    },
    {
        icon: 'log-out-outline',
        text: 'Salir',
        isArrow: false,
        logout: true
    }
]