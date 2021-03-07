const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

class Tag {
    constructor(values, selector) {
        this.values = values;
        this.positionStep = [3, 3];
        this.prevStep = [];
        this.container = document.querySelector(selector);
        this.init();
    }

    init() {
        this.collection = this.splitCollection();
        this.renderTable();
        this.eventKey();
    }

    splitCollection() {
        let items = [];
        let chunk = [];
        let result = [];
        const lengthValues = this.values.length;

        for (let index = 0; index < lengthValues; index++) {
            let element = this.values[index];
            items.push(element);
            if ((index + 1) % 4 === 0) {
                chunk.push(items);
                items = [];
                continue;
            }

            if (lengthValues === index + 1) {
                chunk.push(items);
                result = chunk;
            }
        }
        return result;
    }

    renderTable(position = this.positionStep) {
        const body = this.container;
        if (body.querySelector('table')) return;
        const tbl = document.createElement('table');
        const tblBody = document.createElement('tbody');
        for (let x = 0; x < 4; x++) {
            let row = document.createElement('tr');
            for (let y = 0; y < 4; y++) {
                const cell = document.createElement('td');
                cell.setAttribute('class', 'p-3');
                const cellText = document.createTextNode(
                    this.collection[x][y] || '');
                JSON.stringify([x, y]) === JSON.stringify(position) &&
                cell.setAttribute('class', 'p-3 table-active');
                cell.append(cellText);
                row.append(cell);
            }
            tblBody.append(row);
        }
        tbl.append(tblBody);
        body.append(tbl);
        tbl.setAttribute('class', 'table-bordered');
    }

    proceed(position) {
        const [x, y] = position;
        const body = this.container;
        const rows = body.querySelectorAll('tr')[y];
        const cell = rows.querySelectorAll('td')[x];
        cell.classList.toggle('table-active');
        const prevTextCell = cell.innerHTML;
        cell.innerHTML = '';
        return {cell, prevTextCell};
    }

    renderTd(position = this.positionStep, key) {
        const {prevTextCell} = this.proceed(position);
        const {cell} = this.proceed(this.prevStep);
        cell.innerHTML = prevTextCell;
    }

    eventKey() {
        document.addEventListener('keyup', (event) => {
            let key = event.key;
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
                key)) {
                return;
            }
            const [x, y] = this.positionStep;
            this.prevStep = this.positionStep;
            switch (key) {
                case 'ArrowUp':
                    this.positionStep = [x, this.setMin(y + 1)];
                    break;
                case 'ArrowDown':
                    this.positionStep = [x, this.setMax(y - 1)];
                    break;
                case 'ArrowLeft':
                    this.positionStep = [this.setMin(x + 1), y];
                    break;
                case 'ArrowRight':
                    this.positionStep = [this.setMax(x - 1), y];
                    break;
            }
            this.renderTd(this.positionStep, key);
        });
    }

    setMin(value) {
        return value > 3 ? 3 : value;
    }

    setMax(value) {
        return value < 0 ? 0 : value;
    }
}

export default (randomize = _.shuffle) => {
    const random = randomize(values);
    new Tag(random, '.gem-puzzle');
}
