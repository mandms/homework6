import "./style.css";


class User {

    constructor(fields) {
        this.fields = fields;
    }

    async getAll() {
        const output = this.fields.outputs[0];
        const outputStatus = this.fields.statusCode[0];
        const response = await fetch("/api/users");

        if (response.ok) {
            const data = await response.json();
            output.innerHTML = JSON.stringify(data, null, "  ")
        } else {
            output.innerHTML = `HTTP error: ${response.status}`
        }
        this.setStatus(outputStatus, response);
        hljs.highlightBlock(output)
    }

    setStatus(element, response) {
        element.innerHTML = `${response.status} ${response.statusText}`;
    }

    checkJSONSyntax(value) {
        try {
            value = JSON.parse(value)
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new SyntaxError("There was a syntax error. Please correct it and try again: " + error.message);
            } else {
                console.log(error)
            }
        }
        return value;
    }

    async getById() {
        const userId = this.fields.inputs[0].value;
        const output = this.fields.outputs[1];
        const outputStatus = this.fields.statusCode[1];

        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
            const data = await response.json();
            output.innerHTML = JSON.stringify(data, null, "  ");
        } else {
            output.innerHTML = `HTTP error: ${response.status}`;
        }
        this.setStatus(outputStatus, response);
        hljs.highlightBlock(output)
    }

    async create() {
        const textarea = this.fields.textareas[0];
        const output = this.fields.outputs[2];
        const outputStatus = this.fields.statusCode[2];

        try {
            const validJSON = this.checkJSONSyntax(textarea.value)
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: await JSON.stringify(validJSON)
            });

            if (response.ok) {
                const data = await response.json();
                output.innerHTML = JSON.stringify(data, null, "  ")
            } else {
                console.log(response);
                output.innerHTML = `HTTP error: ${response.status}`;
            }
            this.setStatus(outputStatus, response);
        } catch (error) {
            output.innerHTML = error.message;
        }
        hljs.highlightBlock(output);
    }

    async update() {
        const textarea = this.fields.textareas[1];
        const userId = this.fields.inputs[1].value;
        const output = this.fields.outputs[3];
        const outputStatus = this.fields.statusCode[3];

        try {
            const validJSON = this.checkJSONSyntax(textarea.value)
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: await JSON.stringify(validJSON)
            });

            if (response.ok) {
                const data = await response.json();
                output.innerHTML = JSON.stringify(data, null, "  ")
            } else {
                console.log(response);
                output.innerHTML = `HTTP error: ${response.status}`;
            }
            this.setStatus(outputStatus, response);
        } catch (error) {
            output.innerHTML = error.message;
        }
        hljs.highlightBlock(output)
    }

    async delete() {
        const userId = this.fields.inputs[2].value;
        const output = this.fields.outputs[4];
        const outputStatus = this.fields.statusCode[4];

        const response = await fetch(`/api/users/${userId}`,
            {
                method: 'DELETE',
            });

        if (response.ok) {
            const data = await response.json();
            output.innerHTML = JSON.stringify(data, null, "  ")
        } else {
            output.innerHTML = `HTTP error: ${response.status}`
        }
        this.setStatus(outputStatus, response);
        hljs.highlightBlock(output)
    }
}

window.onload = () => {
    const fields = {
        buttons: document.getElementsByClassName('query__execute'),
        textareas: document.getElementsByClassName('request__textarea'),
        inputs: document.getElementsByClassName('request__param'),
        outputs: document.getElementsByClassName('response__body'),
        statusCode: document.getElementsByClassName('response__code')
    }

    const user = new User(fields);

    [...fields.buttons].forEach((button, index) => {
        console.log(index);
        switch (index) {
            case 0:
                button.addEventListener('click', () => user.getAll());
                break
            case 1:
                button.addEventListener('click', () => user.getById());
                break
            case 2:
                button.addEventListener('click', () => user.create());
                break
            case 3:
                button.addEventListener('click', () => user.update());
                break
            case 4:
                button.addEventListener('click', () => user.delete());
                break
        }
    })
};