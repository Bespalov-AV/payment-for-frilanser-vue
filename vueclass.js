
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
            'del': 'Удалить'
          },
        emptyLine:  {
            id: 0,
            date: new Date(),
            summa: 0,
            client: '',
            comment: ''
        },
        Clients: ['Все'],
        itClient: 'Все'
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
        },
        delString(item) {
            this.Data.splice(item,1);
        },
        filterOnClient(client) {
            this.itClient = client
            console.log(client)
        }
    }
});

tableVue.getStorage();

