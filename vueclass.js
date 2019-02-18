const Payment = new PaymentClass();
Payment.Init();

const mainVue = new Vue({
    el: "#aside-left",
    data: {
        Clients: Payment.Clients
    },
    methods: {
        addClient: function(env) {
            this.Clients.add(env.target.value)
            env.target.value = ''
            console.log(Payment.Clients)
        } 
    }
    
});