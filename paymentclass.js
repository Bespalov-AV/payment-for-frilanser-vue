"use strict";
class PaymentClass {
  constructor() {
    this.tableHeader = {
      'id': 'Номер',
      'date': 'Дата',
      'summa': 'Сумма',
      'client': 'Клиент',
      'comment': 'Комментарий',
    };
    this.emptyLine = {
      id: 0,
      date: new Date(),
      summa: 0,
      client: '',
      comment: ''
    };

    this.Data = [];
    this.Clients = new Set(['Все']);
  }
  
  Init() {
    this.clearTable();

    this.getStorage();

    this.addButtonAdd(this.divMain, ['btn', 'btn-add']);
    this.addButtonSave(this.divMain, ['btn', 'btn-save']); 

    const inputClient= this.addInputClient("", "text", "client", "input-client");
    this.divAside.appendChild(inputClient);
  };

 setStorage() {
    if (chrome.storage) {
      console.log(this.Data);
      chrome.storage.sync.set({"pymentData": this.Data});
    } else {
      localStorage["pymentData"] = JSON.stringify(this.Data);
    }
  };

  getStorage() {
    if (chrome.storage) {
       chrome.storage.sync.get(["pymentData"], (result) => {
        const Data = result.pymentData;
        this.Data = Data;

        this.getClients();
        this.fullClients();
        this.fullTable(Data);
       });
      } else {
        if (localStorage["pymentData"]) {
          const Data = JSON.parse(localStorage["pymentData"]);
          this.Data = Data;

          this.getClients();
          this.fullClients();
          this.fullTable(Data);
        }
    }
  };

  fullClients() {
    this.ulCat.innerHTML = '';
    for (const client of this.Clients) {
      const li = document.createElement('li');
      li.textContent = client;
      this.ulCat.appendChild(li);
      
      li.addEventListener('click', (env) => {
        const itClient = env.currentTarget.textContent;

        if (itClient == 'Все') {
          this.fullTable(this.Data);  
          return;
        }

        const itClientData = new Array();

        for (const data of this.Data) {
          if (data.client == itClient) {
            itClientData.push(data);
          }
        }

        this.fullTable(itClientData);
      });
    }
  };

  getClients() {
    for (const data of this.Data) {
      this.Clients.add(data.client);
    }
  };

  fullTable(Data) {
    this.clearTable();
    if (Data) {
      const tbody= document.createElement("tbody");
      Data.forEach(element => {
        this.addNewRow(element, tbody);
      });
      this.table.appendChild(tbody);
    }
  };

  clearTable() {
    this.table.innerText='';
    this.addTableHeader();
  }

  addTableHeader() {
    const header = this.table.createTHead();
    const row = header.insertRow(0);    
    for (const key in this.tableHeader) {
      row.insertCell().textContent = this.tableHeader[key];
    }
    row.insertCell().textContent = 'Удалить';
  }

  addNewRow(element, tbody, isNew) {
    const row = tbody.insertRow();

    if (isNew == true) {
      let id = 0;
      if (this.Data.length > 0) {
        id = this.Data[this.Data.length-1].id;
        id++;
      }
      this.Data.push(this.emptyLine);
      element.id = id;
    }

    const inputId = this.addInput(element.id, 'id', 'id', 'input-id');
    inputId.setAttribute('readonly', true)
    row.insertCell(0).appendChild(inputId);
    row.insertCell(1).appendChild(this.addInput(element.date, 'date', 'date', 'input-date'));
    row.insertCell(2).appendChild(this.addInput(element.summa, 'number', 'summa', 'input-summa'));
    row.insertCell(3).appendChild(this.addSelect(element.client,'client-select'));
    row.insertCell(4).appendChild(this.addInput(element.comment, 'text', 'comment', 'input-comment'));

    row.insertCell(5).appendChild(this.addButtonDel());

    row.addEventListener('change', (env) => {
      const rowIndex = env.currentTarget.rowIndex;
      this.setRowDatatoData(rowIndex);
    });
  };

  setRowDatatoData(rowIndex) {
    const itRow = this.table.rows[rowIndex];
    const itData = {};
    for (let cell=0; cell < itRow.cells.length; cell++) 
    {
      const itCell = itRow.cells[cell];
      const cildNode = itCell.childNodes[0];

      switch (cildNode.nodeName) {
        case 'INPUT' :
        itData[cildNode.name] = cildNode.value;
        break;
        case 'SELECT':
        itData[cildNode.name] = cildNode.value;
        break;
        default:
        itData[cildNode.name] = cildNode.textContent;
      }
    }
    
    this.Data.forEach( (element, ind) => {
      if (element.id == itData.id) {
        this.Data[ind] = itData;
      }
    })
  };
  
  addInput(value, type, name, className) {
    const input = document.createElement('input');
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.value = value;
    input.valueAsDat = value;
    input.classList.add(className);

    return input;
  };
  addInputClient(value, type, name, className) {
    const input = document.createElement('input');
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.value = value;
    input.valueAsDat = value;
    input.classList.add(className);

    input.onchange = (env) => {
      this.Clients.add(input.value);

      this.fullClients();
      this.fullTable(this.Data);

      input.value= '';
    }

    return input;
  };

  addSelect(curentClient, className) {
    const select = document.createElement('select');
    select.classList.add(className)
    select.setAttribute("name", "client");

    for (const client of this.Clients) {
      if (client != 'Все') {
        const option = document.createElement('option');
        option.value = client;
        option.textContent = client;
        select.appendChild(option);
      }

      select.value = curentClient;
  
      select.onchange = (env) => {
        const rowIndex = env.currentTarget.rowIndex;
        this.setRowDatatoData(rowIndex);
      }
    }
    
    return select;
  }

  addButtonAdd(div, className) {
    const btn = document.createElement('button');
    btn.classList.add(...className);
    btn.name = 'ButtonAdd';
    btn.innerText = 'Добавить запись';
    div.appendChild(btn);

    btn.addEventListener('click', (env) => {
      const tbody= document.createElement("tbody");
      this.addNewRow(this.emptyLine, tbody, true);
      this.table.appendChild(tbody);
    });
  };

  addButtonSave(div, className) {
    const btn = document.createElement('button');
    btn.classList.add(...className);
    btn.name = 'ButtonSave';
    btn.innerText = 'Сохранить';
    div.appendChild(btn);

    btn.addEventListener('click', (env) =>  {
      this.setStorage();
    });
  };

  addButtonDel()  {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-del');
    btn.name = 'ButtonDel';
    btn.innerText = 'X';

    btn.addEventListener('click', (env) =>  {
      const rowIndex = env.target.parentElement.parentElement.rowIndex;
      const id = this.table.rows[rowIndex].cells[0].firstChild.value;
      this.table.deleteRow(rowIndex);

      this.Data.forEach((element, index) => {
        if (element.id == id) {
          this.Data.splice(index, 1);
        }
      })
    })  
    
    return btn;
  };
};
