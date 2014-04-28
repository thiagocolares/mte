<?php

class LoginController extends Base_Controller_Action {

    public function indexAction() {

        $this->view->title = "MTE";
    }

    public function loginAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        # Verifica se existe dados enviados via POST
        if ($this->getRequest()->isPost()) {
            
            $login = $this->_request->getParam('email');
            $senha = $this->_request->getParam('senha');

            $dbAdapter = Zend_Db_Table::getDefaultAdapter();

            # Inicia o adaptador Zend_Auth para banco de dados
            $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);
            $authAdapter->setTableName('usuario')
                    ->setIdentityColumn('email')
                    ->setCredentialColumn('senha');

            # Define os dados para processar o login
            $authAdapter
                    ->setIdentity($login)
                    ->setCredential((md5($senha)));

            try {

                # Efetua login
                $auth = Zend_Auth::getInstance();
                $result = $auth->authenticate($authAdapter);
                
            } catch (Zend_Db_Exception $e) {
                echo "<pre>";
                print_r($e->getMessage());
                echo "<br/>";
                die(__FILE__ . " - " . __LINE__);
            }

            $msn = array();
            $arrayRetorno = array();

            # Verifica se o login foi efetuado com sucesso
            if ($result->isValid()) {
                # Armazena os dados do usuário em sessão (exceto senha)
                $info = $authAdapter->getResultRowObject(null, 'senha');
                $storage = $auth->getStorage();

                //$objPerfil = new PerfilUsuario();
                //$rsPerfil = $objPerfil->fetchAll("idUsuario = {$info->idUsuario}")->toArray();

                //if ($rsPerfil[0]['idPerfil'] == '2') {
                    $info->isAdmin = true;
                //} else {
                //    $info->isAdmin = false;
                //}

                $storage->write($info);

                # Retorna success pro JavaScript
                $msn['type'] = 'success';
        
            } else {
                    # Retorna error pro javascript
                    $msn['type'] = 'error';
                    $msn['msn'] = 'Autenticação inválida!';
            }

            echo json_encode($msn);
            die();
        }
    }

    public function logoutAction() {
        Zend_Auth::getInstance()->getStorage()->clear();
        $this->_redirect('/');
    }

}
