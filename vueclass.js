
const tableVue = new Vue({
    el: '#contener',
    data: {
        Data: [],
        tableHeader: {
            'id': 'Номер',
            'date': 'Дата',
            'summa': 'Сумма',
            'client': 'Клиент',
            'comment': 'Комментарий',
          },
        emptyLine:  {
            id: 0,
            date: new Date(),
            summa: 0,
            client: '',
            comment: ''
        },
        Clients: []
    },
    methods: {
        setStorage(env) {
            if (chrome.storage) {
                chrome.storage.sync.set({"pymentData": this.Data});
            } else {
                localStorage["pymentData"] = JSON.stringify(this.Data);
            }
        },
        getStorage() {
            if (chrome.storage) {
               chrome.storage.sync.get(["pymentData"], (result) => {
                this.Data = result.pymentData;
               });
              } else {
                if (localStorage["pymentData"]) {
                    this.Data = JSON.parse(localStorage["pymentData"]);
                }
                this.getClients();
            }
        },
        getClients() {
            if (this.Clients.length == 0) {
                this.Clients.push('Все')
            }
            for (const data of this.Data) {
               this.setClients(data.client)
            }
        },
        addClient(env) {
            this.setClients(env.target.value)
            env.target.value = ''
        },
        addString() {
            const newLine = Object.assign({}, this.emptyLine)
            this.Data.push(newLine)
        },
        setClients(client) {
            const tempClients = new Set(this.Clients)
            tempClients.add(client)
            this.Clients= Array(...tempClients)
        }

    }

});

tableVue.getStorage();

// const clientVue = new Vue({
//     el: "#aside-left",
//     data: {
//         Clients: tableVue.Clients
//     },
//     methods: {
//         addClient: function(env) {
//             this.Clients.add(env.target.value)
//             env.target.value = ''
//         }
//     }
//
// });
