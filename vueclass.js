const Payment = new PaymentClass();
Payment.Init();

const clientVue = new Vue({
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

const tableVue = new Vue({
    el: '#payment-table',
    data: {
      items: [
        { xxx: 'aaa', yyy: '!!!', zzz: '111' },
        { xxx: 'bbb', yyy: '???', zzz: '222' },
        { xxx: 'ccc', yyy: ':::', zzz: '333' },
      ],
    },
  });