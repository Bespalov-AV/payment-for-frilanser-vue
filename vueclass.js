
const tableVue = new Vue({
    el: '#main',
    data: {
        Data: [],
        tableHeader: {
            'id': 'Номер',
            'date': 'Дата',
            'summa': 'Сумма',
            'client': 'Клиент',
            'comment': 'Комментарий',
          },
        Clients: new Set()
    },
    methods: {
        setStorage: function(env) {
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
        
                this.getClients();
               });
              } else {
                if (localStorage["pymentData"]) {
                    this.Data = JSON.parse(localStorage["pymentData"]);
        
                  this.getClients();
                }
            }
        },
        getClients() {
            for (const data of this.Data) {
              this.Clients.add(data.client);
            }
          }
    }
});

tableVue.getStorage();

const clientVue = new Vue({
    el: "#aside-left",
    data: {
        Clients: tableVue.Clients
    },
    methods: {
        addClient: function(env) {
            this.Clients.add(env.target.value)
            env.target.value = ''
        } 
    }
    
});
