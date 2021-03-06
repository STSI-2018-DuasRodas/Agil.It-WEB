import React, { Component } from 'react';
import {
  Button,
  DialogContainer,
  Divider,
  Toolbar,
  FontIcon,
} from 'react-md';

import C_TextField from '../components/TextField';
import C_SelectField from '../components/SelectField';
import C_CrudButtons from '../components/CrudButtons';
import { HandlerProvider } from '../providers/handler';
import { OrderLayoutProvider } from '../providers/OrderLayout';
import C_AutoComplete from '../components/AutoComplete';
import { ObjectHelper } from '../helpers/Object';
class CreateOrderLayout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      fields: {},
      layouts: [{
        label: 'Corretiva / Preventiva',
        value: 'default',
      },
      {
        label: 'Rota',
        value: 'route',
      },
      {
        label: 'Lista',
        value: 'list',
      }],
      autocomplete: "",
      list: []
    };

    this.provider = new HandlerProvider(new OrderLayoutProvider(), "tipo de ordem de manutenção")
    this.loadList();

    this.hideModal = this.hideModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
    this.clean = this.clean.bind(this);
    this.delete = this.delete.bind(this);
    this.autocompleteSelect = this.autocompleteSelect.bind(this);
  }

  async loadList() {
    let list = []
    let response = await this.provider.getList();
    if (response.success) {
      list = response.data
    }
    this.setState({ list })
  }

  autocompleteSelect(id) {

    if (id === undefined) {
      this.clean()
      return
    }

    let item = this.state.list.find(element => element.id === id)

    let fields = {
      id: item.id,
      orderLayoutType: item.orderLayout,
      classification: item.classification,
      type: item.type
    }

    this.setState({ fields })
  }

  hideModal() {
    this.setState({ visible: false })
    this.props.onClose()
  }

  clean() {
    var fields = this.state.fields;

    ObjectHelper.clearFields(fields);

    this.loadList()
    this.setState({ fields, autocomplete: "" });
  }

  delete() {
    let orderLayout = this.state.fields;
    this.provider.delete(orderLayout.id, this.clean)
  }

  save() {
    let orderLayout = this.state.fields;
    this.provider.save(orderLayout, this.clean)
  }

  onChange(e, name) {

    if (name === "id") {
      this.setState({ autocomplete: e })
      return
    }

    let fields = this.state.fields;

    fields[e.target.name] = e.target.value;
    this.setState({ fields });
  }

  formPreventDefault(event) {
    event.preventDefault()
  }

  render() {
    // const { visible } = this.state;
    return (
      <DialogContainer
        id="simple-full-page-dialog"
        visible={this.state.visible}
        width="40%"
        height="75%"
        dialogStyle={{borderRadius:5}}
        aria-labelledby="simple-full-page-dialog-title"
      >
        <Toolbar
          fixed
          colored
          title="Cadastrar Layout de Ordem de Manutenção"
          style={{borderRadius:5}}
          actions={<FontIcon style={{ cursor: "pointer" }} onClick={() => this.hideModal()}>close</FontIcon>}
        />
        <section className="md-toolbar-relative">
          <form ref={(el) => this.form = el} onSubmit={this.formPreventDefault}>
            <C_AutoComplete
              id="id"
              name="id"
              description="classification"
              value={this.state.autocomplete}
              label="Buscar Layout"
              placeholder="Buscar Layout"
              rightIcon="search"
              block paddedBlock
              list={this.state.list}
              dataSelected={this.autocompleteSelect}
              onChange={this.onChange}
            /><br></br>
            <C_SelectField
              id="orderLayout"
              name="orderLayout"
              value={this.state.fields.orderLayoutType}
              onChange={this.onChange}
              type="text"
              label="Layout da Ordem"
              list={this.state.layouts}
              required={true}
              style={{ width: "100%" }}
            /><br></br>
            <C_TextField
              id="type"
              name="type"
              value={this.state.fields.type}
              onChange={this.onChange}
              type="text"
              label="Tipo"
              placeholder="Tipo"
            /><br></br>
            <C_TextField
              id="classification"
              name="classification"
              value={this.state.fields.classification}
              onChange={this.onChange}
              type="text"
              label="Classificação"
              placeholder="Classificação"
            />
          </form>
        </section>
        <C_CrudButtons
          onSave={this.save}
          onClean={this.clean}
          onDelete={this.delete}
          crudLevel={!!this.state.fields.id}
        />
      </DialogContainer>
    );
  }
}

export default CreateOrderLayout;