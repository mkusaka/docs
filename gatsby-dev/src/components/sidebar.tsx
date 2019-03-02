import React, { Component } from "react";
import * as SemanticUi from 'semantic-ui-react';
import { render } from "react-dom";

export default class Sidebar extends Component {
  state = { visible: false }

  handleHideClick = () => this.setState({ visible: false })
  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    const { visible } = this.state

    return (
      <>
        <SemanticUi.Button.Group>
          <SemanticUi.Button disabled={visible} onClick={this.handleShowClick}>
            Show Sidebar
          </SemanticUi.Button>
          <SemanticUi.Button disabled={!visible} onClick={this.handleHideClick}>
            Hide sidebar
          </SemanticUi.Button>
        </SemanticUi.Button.Group>
        <SemanticUi.Sidebar.Pushable as={SemanticUi.Segment}>
          <SemanticUi.Sidebar
            as={SemanticUi.Menu}
            animation='overlay'
            icon='labeled'
            inverted
            onHide={this.handleSidebarHide}
            vertiacl
            visible={visible}
            width='thin'
          >
          </SemanticUi.Sidebar>
        </SemanticUi.Sidebar.Pushable>
      </>
    )
  }
}
