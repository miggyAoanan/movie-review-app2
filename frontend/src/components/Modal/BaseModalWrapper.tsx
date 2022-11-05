
import React, { MouseEventHandler, ReactNode } from 'react'

import Modal from './Modal';
import { Actor } from '../../interfaces'

import {  Header, Message, CloseSign } from './ModalPopup.styled'

export interface BaseModalWrapperProps {
    isModalVisible?: boolean;
    onBackdropClick: () => void;
    header?: string;
    message?: string;
    content?: ReactNode;
    forUpdateId?: string;
    forDeleteId?: string;
}

interface ComponentsProps {
    ContainerComponent: React.ComponentType<{
        children?:ReactNode
    }>;
    CloseButtonComponent: React.ComponentType<{
      onClick?: MouseEventHandler<any>;
      children?:ReactNode
    }>;
  }
  
type Props =  BaseModalWrapperProps & ComponentsProps;

const BaseModalWrapper: React.FC<Props> = ({forUpdateId,forDeleteId, content, isModalVisible, onBackdropClick, header, message, ContainerComponent, CloseButtonComponent }) => {
    if (!isModalVisible) {
        return null
    }
  
    return (<Modal onBackdropClick={onBackdropClick}>
        <ContainerComponent>
            <CloseButtonComponent onClick={onBackdropClick}>
                <CloseSign />
            </CloseButtonComponent>
            <Header>{header}</Header>
            {message && <Message> {message}</Message>}
            {content}
           
        </ContainerComponent>

    </Modal>);
}

export default BaseModalWrapper