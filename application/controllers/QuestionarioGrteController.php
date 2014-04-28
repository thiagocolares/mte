<?php

class QuestionarioGrteController extends Base_Controller_Action {

    public function indexAction() {
        
    }

    public function indexGrteAction() {
        
    }

    public function grteAction() {

//Verificando se é uma edição
        if ($this->_request->getParam('id_questionario_grte')) {
            $this->view->id_questionario_grte = $this->_request->getParam('id_questionario_grte');
        } else {
            $this->view->id_questionario_grte = "";
        }

//Carregando lista de UFs

        $objUf = new Uf();
        $this->view->listaUf = $objUf->getAll();
    }

    public function ajaxVerificaCodigoGrteAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $objPosto = new Posto();

        $arrRs = $objPosto->getPosto($this->_request->getParam('codigo_grte'), 'GRTE');

        $nsPosto = new Zend_Session_Namespace();

        if ($arrRs) {
            $nsPosto->posto = $arrRs;
        } else {
            $nsPosto->posto = array();
        }

        echo Zend_Json_Encoder::encode($arrRs);

        die();
    }

    public function ajaxCarregarGrteAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $idquestionario = $this->_request->getParam('id_questionario_grte');
        $objquestionario = new QuestionarioGrte();

        $arrDados = $objquestionario->getquestionarioGrte($idquestionario);

        $arrReturn = array();

        $arrReturn['bloco1']['id_questionario_grte'] = $arrDados[0]['id_questionario_grte'];
        $arrReturn['bloco1']['codigo_posto'] = $arrDados[0]['codigo_posto'];
        $arrReturn['bloco1']['nome_pesquisador'] = $arrDados[0]['nome_pesquisador'];
        $arrReturn['bloco1']['data_levantamento'] = $arrDados[0]['data_levantamento'];
        $arrReturn['bloco1']['nome_grte'] = $arrDados[0]['nome_grte'];
        $arrReturn['bloco1']['codigo_grte'] = $arrDados[0]['codigo_grte'];
        $arrReturn['bloco1']['endereco_grte'] = $arrDados[0]['endereco_grte'];
        $arrReturn['bloco1']['localizado_endereco_registrado'] = $arrDados[0]['localizado_endereco_registrado'];
        $arrReturn['bloco1']['comentario_endereco_grte'] = $arrDados[0]['comentario_endereco_grte'];
        $arrReturn['bloco1']['telefone_grte'] = $arrDados[0]['telefone_grte'];
        $arrReturn['bloco1']['cidade_grte'] = $arrDados[0]['cidade_grte'];
        $arrReturn['bloco1']['uf_grte'] = $arrDados[0]['uf_grte'];
        $arrReturn['bloco1']['nome_entrevistado'] = $arrDados[0]['nome_entrevistado'];
        $arrReturn['bloco1']['email_entrevistado'] = $arrDados[0]['email_entrevistado'];
        $arrReturn['bloco1']['cargo_entrevistado'] = $arrDados[0]['cargo_entrevistado'];
        $arrReturn['bloco1']['tempo_cargo_ano'] = $arrDados[0]['tempo_cargo_ano'];
        $arrReturn['bloco1']['tempo_cargo_meses'] = $arrDados[0]['tempo_cargo_meses'];
        $arrReturn['bloco1']['nome_demais_entrevistados_01'] = $arrDados[0]['nome_demais_entrevistados_01'];
        $arrReturn['bloco1']['email_demais_entrevistados_01'] = $arrDados[0]['email_demais_entrevistados_01'];
        $arrReturn['bloco1']['nome_demais_entrevistados_02'] = $arrDados[0]['nome_demais_entrevistados_02'];
        $arrReturn['bloco1']['email_demais_entrevistados_02'] = $arrDados[0]['email_demais_entrevistados_02'];
        $arrReturn['bloco1']['nome_demais_entrevistados_03'] = $arrDados[0]['nome_demais_entrevistados_03'];
        $arrReturn['bloco1']['email_demais_entrevistados_03'] = $arrDados[0]['email_demais_entrevistados_03'];
        $arrReturn['bloco1']['nome_demais_entrevistados_04'] = $arrDados[0]['nome_demais_entrevistados_04'];
        $arrReturn['bloco1']['email_demais_entrevistados_04'] = $arrDados[0]['email_demais_entrevistados_04'];

        $arrq15 = array();


        if ($arrDados[0]['q15_01_emissao_via_1']) {
            $arrq15[] = '15-1';
        }

        if ($arrDados[0]['q15_02_emissao_via_2']) {
            $arrq15[] = '15-2';
        }

        if ($arrDados[0]['q15_03_emissao_sd_on_line']) {
            $arrq15[] = '15-3';
        }

        if ($arrDados[0]['q15_04_emissao_sd_off_line']) {
            $arrq15[] = '15-4';
        }

        if ($arrDados[0]['q15_05_orientacao_profissional']) {
            $arrq15[] = '15-5';
        }

        if ($arrDados[0]['q15_06_atendimento_psicologos']) {
            $arrq15[] = '15-6';
        }

        if ($arrDados[0]['q15_07_outras']) {
            $arrq15[] = '15-7';
        }

        $arrReturn['bloco2']['q15'] = $arrq15;
        $arrReturn['bloco2']['q15_07_outras_quais'] = $arrDados[0]['q15_07_outras_quais'];

        $arrReturn['bloco3']['q16'] = $arrDados[0]['q16'];
        $arrReturn['bloco3']['q16_descrever'] = $arrDados[0]['q16_descrever'];
        $arrReturn['bloco3']['q17'] = $arrDados[0]['q17'];
        $arrReturn['bloco3']['q17_descrever'] = $arrDados[0]['q17_descrever'];
        $arrReturn['bloco3']['q18_00'] = $arrDados[0]['q18_00'];
        $arrReturn['bloco3']['q18_01_recepcao'] = $arrDados[0]['q18_01_recepcao'];
        $arrReturn['bloco3']['q18_02_seguranca'] = $arrDados[0]['q18_02_seguranca'];
        $arrReturn['bloco3']['q18_03_limpeza'] = $arrDados[0]['q18_03_limpeza'];
        $arrReturn['bloco3']['q18_04_manutencao'] = $arrDados[0]['q18_04_manutencao'];
        $arrReturn['bloco3']['q18_05_outras'] = $arrDados[0]['q18_05_outras'];
        $arrReturn['bloco3']['q19'] = $arrDados[0]['q19'];
        $arrReturn['bloco3']['q20'] = $arrDados[0]['q20'];
        $arrReturn['bloco3']['q20_descrever'] = $arrDados[0]['q20_descrever'];
        $arrReturn['bloco3']['q21'] = $arrDados[0]['q21'];
        $arrReturn['bloco3']['q21_descrever'] = $arrDados[0]['q21_descrever'];
        $arrReturn['bloco3']['q22_01'] = $arrDados[0]['q22_01'];
        $arrReturn['bloco3']['q22_02'] = $arrDados[0]['q22_02'];
        $arrReturn['bloco3']['q22_03'] = $arrDados[0]['q22_03'];
        $arrReturn['bloco3']['q22_04'] = $arrDados[0]['q22_04'];
        $arrReturn['bloco3']['q23'] = $arrDados[0]['q23'];
        $arrReturn['bloco3']['q24'] = $arrDados[0]['q24'];
        $arrReturn['bloco3']['q24_descrever'] = $arrDados[0]['q24_descrever'];
        $arrReturn['bloco3']['q25'] = $arrDados[0]['q25'];
        $arrReturn['bloco3']['q25_descrever'] = $arrDados[0]['q25_descrever'];

        $arrReturn['bloco4']['q26_01_guiche_preferencial'] = $arrDados[0]['q26_01_guiche_preferencial'];
        $arrReturn['bloco4']['q26_02_rampa_acesso'] = $arrDados[0]['q26_02_rampa_acesso'];
        $arrReturn['bloco4']['q26_03_banheiro_adaptado'] = $arrDados[0]['q26_03_banheiro_adaptado'];
        $arrReturn['bloco4']['q26_04_funcionario_treinado_libras'] = $arrDados[0]['q26_04_funcionario_treinado_libras'];
        $arrReturn['bloco4']['q26_05_funcionario_treinado_primeiro_emprego'] = $arrDados[0]['q26_05_funcionario_treinado_primeiro_emprego'];
        $arrReturn['bloco4']['q26_06_outra'] = $arrDados[0]['q26_06_outra'];
        $arrReturn['bloco4']['q26_06_qual'] = $arrDados[0]['q26_06_qual'];
        $arrReturn['bloco4']['q26_observacao'] = $arrDados[0]['q26_observacao'];
        $arrReturn['bloco4']['q26_01_guiche_preferencial'] = $arrDados[0]['q26_01_guiche_preferencial'];

        if ($arrDados[0]['q27_hora']) {
            if (!$arrDados[0]['q27_minutos']) {
                $arrReturn['bloco4']['q27_hora_minutos'] = $arrDados[0]['q27_hora'] . ":00";
            } else {
                $arrReturn['bloco4']['q27_hora_minutos'] = $arrDados[0]['q27_hora'] . ":" . $arrDados[0]['q27_minutos'];
            }
        } else {
            if ($arrDados[0]['q27_minutos']) {
                $arrReturn['bloco4']['q27_hora_minutos'] = "00:" . $arrDados[0]['q27_minutos'];
            }
        }

        $arrReturn['bloco4']['q27_observacao'] = $arrDados[0]['q27_observacao'];
        $arrReturn['bloco4']['q28'] = $arrDados[0]['q28'];
        $arrReturn['bloco4']['q28_descrever'] = $arrDados[0]['q28_descrever'];

        $arrReturn['bloco5']['q29_01_sigae_mae'] = $arrDados[0]['q29_01_sigae_mae'];
        $arrReturn['bloco5']['q29_02_sigae_web'] = $arrDados[0]['q29_02_sigae_web'];
        $arrReturn['bloco5']['q29_03_portal_mais_emprego'] = $arrDados[0]['q29_03_portal_mais_emprego'];
        $arrReturn['bloco5']['q29_04_sistema_proprio'] = $arrDados[0]['q29_04_sistema_proprio'];
        $arrReturn['bloco5']['q29_05_outro'] = $arrDados[0]['q29_05_outro'];
        $arrReturn['bloco5']['q29_05_quais'] = $arrDados[0]['q29_05_quais'];
        $arrReturn['bloco5']['q30'] = $arrDados[0]['q30'];
        $arrReturn['bloco5']['q30_descrever'] = $arrDados[0]['q30_descrever'];
        $arrReturn['bloco5']['q31'] = $arrDados[0]['q31'];
        $arrReturn['bloco5']['q31_descrever'] = $arrDados[0]['q31_descrever'];
        $arrReturn['bloco5']['q32'] = $arrDados[0]['q32'];
        $arrReturn['bloco5']['q32_descrever'] = $arrDados[0]['q32_descrever'];
        $arrReturn['bloco5']['q33_01'] = $arrDados[0]['q33_01'];
        $arrReturn['bloco5']['q33_02'] = $arrDados[0]['q33_02'];
        $arrReturn['bloco5']['q33_03'] = $arrDados[0]['q33_03'];
        $arrReturn['bloco5']['q33_04'] = $arrDados[0]['q33_04'];
        $arrReturn['bloco5']['q33_05'] = $arrDados[0]['q33_05'];
        $arrReturn['bloco5']['q33_06'] = $arrDados[0]['q33_06'];
        $arrReturn['bloco5']['q33_07'] = $arrDados[0]['q33_07'];
        $arrReturn['bloco5']['q33_08'] = $arrDados[0]['q33_08'];
        $arrReturn['bloco5']['q33_09_outro_01'] = $arrDados[0]['q33_09_outro_01'];
        $arrReturn['bloco5']['q33_09_qtd_outro_01'] = $arrDados[0]['q33_09_qtd_outro_01'];
        $arrReturn['bloco5']['q33_10_outro_02'] = $arrDados[0]['q33_10_outro_02'];
        $arrReturn['bloco5']['q33_10_qtd_outro_02'] = $arrDados[0]['q33_10_qtd_outro_02'];
        $arrReturn['bloco5']['q33_11_outro_03'] = $arrDados[0]['q33_11_outro_03'];
        $arrReturn['bloco5']['q33_11_qtd_outro_03'] = $arrDados[0]['q33_11_qtd_outro_03'];

        $arrReturn['bloco6']['q34'] = $arrDados[0]['q34'];
        $arrReturn['bloco6']['q34_descrever'] = $arrDados[0]['q34_descrever'];
        $arrReturn['bloco6']['q35'] = $arrDados[0]['q35'];
        $arrReturn['bloco6']['q35_descrever'] = $arrDados[0]['q35_descrever'];

        $arrReturn['bloco7']['q36'] = $arrDados[0]['q36'];
        $arrReturn['bloco7']['q37'] = $arrDados[0]['q37'];
        $arrReturn['bloco7']['q38'] = $arrDados[0]['q38'];
        $arrReturn['bloco7']['q39'] = $arrDados[0]['q39'];

        $arrReturn['bloco8']['q40'] = $arrDados[0]['q40'];
        $arrReturn['bloco8']['q40_observacao'] = $arrDados[0]['q40_observacao'];
        $arrReturn['bloco8']['q41_area_imovel'] = $arrDados[0]['q41_area_imovel'];
        $arrReturn['bloco8']['q41_tipo_medida'] = $arrDados[0]['q41_tipo_medida'];
        $arrReturn['bloco8']['q41_observacao'] = $arrDados[0]['q41_observacao'];
        $arrReturn['bloco8']['q42_inicio'] = $arrDados[0]['q42_inicio'];
        $arrReturn['bloco8']['q42_encerramento'] = $arrDados[0]['q42_encerramento'];
        $arrReturn['bloco8']['q42_observacao'] = $arrDados[0]['q42_observacao'];
        $arrReturn['bloco8']['q43_tempo_atividade_anos'] = $arrDados[0]['q43_tempo_atividade_anos'];
        $arrReturn['bloco8']['q43_tempo_atividade_meses'] = $arrDados[0]['q43_tempo_atividade_meses'];
        $arrReturn['bloco8']['q43_observacao'] = $arrDados[0]['q43_observacao'];

        $arrReturn['bloco9']['q44_01_condicoes_seguranca'] = $arrDados[0]['q44_01_condicoes_seguranca'];
        $arrReturn['bloco9']['q44_01_comentario'] = $arrDados[0]['q44_01_comentario'];
        $arrReturn['bloco9']['q44_02_facilidade_acesso'] = $arrDados[0]['q44_02_facilidade_acesso'];
        $arrReturn['bloco9']['q44_02_comentario'] = $arrDados[0]['q44_02_comentario'];
        $arrReturn['bloco9']['q44_03_local_espacoso'] = $arrDados[0]['q44_03_local_espacoso'];
        $arrReturn['bloco9']['q44_03_comentario'] = $arrDados[0]['q44_03_comentario'];
        $arrReturn['bloco9']['q44_04_ventilado'] = $arrDados[0]['q44_04_ventilado'];
        $arrReturn['bloco9']['q44_04_comentario'] = $arrDados[0]['q44_04_comentario'];
        $arrReturn['bloco9']['q44_05_local_iluminado'] = $arrDados[0]['q44_05_local_iluminado'];
        $arrReturn['bloco9']['q44_05_comentario'] = $arrDados[0]['q44_05_comentario'];
        $arrReturn['bloco9']['q44_06_local_limpo'] = $arrDados[0]['q44_06_local_limpo'];
        $arrReturn['bloco9']['q44_06_comentario'] = $arrDados[0]['q44_06_comentario'];
        $arrReturn['bloco9']['q44_07_banheiro_limpo'] = $arrDados[0]['q44_07_banheiro_limpo'];
        $arrReturn['bloco9']['q44_07_comentario'] = $arrDados[0]['q44_07_comentario'];
        $arrReturn['bloco9']['q44_08_local_espera_espacoso'] = $arrDados[0]['q44_08_local_espera_espacoso'];
        $arrReturn['bloco9']['q44_08_comentario'] = $arrDados[0]['q44_08_comentario'];
        $arrReturn['bloco9']['q44_09_local_espera_ventilado'] = $arrDados[0]['q44_09_local_espera_ventilado'];
        $arrReturn['bloco9']['q44_09_comentario'] = $arrDados[0]['q44_09_comentario'];
        $arrReturn['bloco9']['q44_10_local_espera_iluminado'] = $arrDados[0]['q44_10_local_espera_iluminado'];
        $arrReturn['bloco9']['q44_10_comentario'] = $arrDados[0]['q44_10_comentario'];
        $arrReturn['bloco9']['q44_11_local_espera_limpo'] = $arrDados[0]['q44_11_local_espera_limpo'];
        $arrReturn['bloco9']['q44_11_comentario'] = $arrDados[0]['q44_11_comentario'];
        $arrReturn['bloco9']['q44_12_local_espera_cadeiras'] = $arrDados[0]['q44_12_local_espera_cadeiras'];
        $arrReturn['bloco9']['q44_12_comentario'] = $arrDados[0]['q44_12_comentario'];
        $arrReturn['bloco9']['q44_13_local_espera_necessidades_especiais'] = $arrDados[0]['q44_13_local_espera_necessidades_especiais'];
        $arrReturn['bloco9']['q44_13_comentario'] = $arrDados[0]['q44_13_comentario'];
        $arrReturn['bloco9']['q44_14_local_agua_cafe'] = $arrDados[0]['q44_14_local_agua_cafe'];
        $arrReturn['bloco9']['q44_14_comentario'] = $arrDados[0]['q44_14_comentario'];

        echo Zend_Json_Encoder::encode($arrReturn);
        die();
    }

    public function ajaxSalvarGrteAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        try {

            $arrParametros = $this->_request->getParams();

//Apagando dados de controle do ZF
            unset($arrParametros['action']);
            unset($arrParametros['controller']);
            unset($arrParametros['module']);

//Apagando dados dos anexos 1 e 2 (Bloco 3)
            unset($arrParametros['id_questionario_grte_anx01']);
            unset($arrParametros['nome']);
            unset($arrParametros['area_sd']);
            unset($arrParametros['area_ctps']);
            unset($arrParametros['area_capt_ativa']);
            unset($arrParametros['area_rec_adm']);
            unset($arrParametros['idade']);
            unset($arrParametros['escolaridade']);
            unset($arrParametros['regime_contratacao']);
            unset($arrParametros['tempo_trabalho']);
            unset($arrParametros['curso_curta_duracao']);
            unset($arrParametros['curso_longa_duracao']);
            unset($arrParametros['id_questionario_grte_anx02']);
            unset($arrParametros['codigo_meta']);
            unset($arrParametros['prevista_1']);
            unset($arrParametros['atingida_1']);
            unset($arrParametros['prevista_2']);
            unset($arrParametros['atingida_2']);
            unset($arrParametros['prevista_3']);
            unset($arrParametros['atingida_3']);
            unset($arrParametros['meta_anual_prevista']);
            unset($arrParametros['meta_anual_atingida']);

            //Tratando dados da questão 15, caso a mesma tenha sido preenchida

            if (isset($arrParametros['q15']) && $arrParametros['q15']) {

                $arrquestao15 = array();
                $arrquestao15['q15_01_emissao_via_1'] = 0;
                $arrquestao15['q15_02_emissao_via_2'] = 0;
                $arrquestao15['q15_03_emissao_sd_on_line'] = 0;
                $arrquestao15['q15_04_emissao_sd_off_line'] = 0;
                $arrquestao15['q15_05_orientacao_profissional'] = 0;
                $arrquestao15['q15_06_atendimento_psicologos'] = 0;
                $arrquestao15['q15_07_outras'] = 0;

                foreach ($arrParametros['q15'] as $key => $value) {

                    switch ($value) {
                        case '15-1':
                            $arrquestao15['q15_01_emissao_via_1'] = 1;
                            break;
                        case '15-2':
                            $arrquestao15['q15_02_emissao_via_2'] = 1;
                            break;
                        case '15-3':
                            $arrquestao15['q15_03_emissao_sd_on_line'] = 1;
                            break;
                        case '15-4':
                            $arrquestao15['q15_04_emissao_sd_off_line'] = 1;
                            break;
                        case '15-5':
                            $arrquestao15['q15_05_orientacao_profissional'] = 1;
                            break;
                        case '15-6':
                            $arrquestao15['q15_06_atendimento_psicologos'] = 1;
                            break;
                        case '15-7':
                            $arrquestao15['q15_07_outras'] = 1;
                            break;
                    }
                }

                unset($arrParametros['q15']);

                $arrParametros = array_merge($arrParametros, $arrquestao15);
            }

//Tratando dado da questão 27
            if ($arrParametros['q27_hora_minutos']) {
                $arrAux = explode(":", $arrParametros['q27_hora_minutos']);
                $arrParametros['q27_hora'] = $arrAux[0];
                $arrParametros['q27_minutos'] = $arrAux[1];
            }
            unset($arrParametros['q27_hora_minutos']);

            if (!$arrParametros['codigo_posto']) {
                throw new Exception('Código do posto não encontrado');
            }

            //Setando ID do usuário logado
            $dadosUsuario = Zend_Auth::getInstance()->getIdentity();
            $arrParametros['id_usuario_cadastro'] = $dadosUsuario->id_usuario;

            //Verificando o id do questionario
            if (!$arrParametros['id_questionario_grte']) {
                unset($arrParametros['id_questionario_grte']);
            }

            //Setando null para os campos vazios
            foreach ($arrParametros as $key => $value) {
                if (!$value) {
                    $arrParametros[$key] = new Zend_Db_Expr('NULL');
                }
            }

            $objquestionarioGrte = new QuestionarioGrte();
            $idquestionario = $objquestionarioGrte->salvar($arrParametros);

            $arrReturn['msn'] = "Questionário salvo com sucesso!";
            $arrReturn['type'] = "success";
            $arrReturn['id_questionario_grte'] = $idquestionario;
        } catch (Exception $e) {

            $arrReturn['msn'] = $e->getMessage();
            $arrReturn['type'] = "error";
        }

        echo Zend_Json_Encoder::encode($arrReturn);

        die();
    }

    public function ajaxCarregarAnexoUmAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $arrParametros = $this->_request->getParams();

        //Apagando dados de controle do ZF
        unset($arrParametros['action']);
        unset($arrParametros['controller']);
        unset($arrParametros['module']);

        $objAnexoUm = new AnexoUmGrte();

        $arrDados = $objAnexoUm->getAnexoUm($arrParametros['id_questionario_grte_anx01']);

        if ($arrDados) {
            echo Zend_Json_Encoder::encode($arrDados[0]);
        } else {
            echo Zend_Json_Encoder::encode(array());
        }

        die();
    }

    public function ajaxSalvarAnexoUmAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        try {

            $arrParametros = $this->_request->getParams();

//Apagando dados de controle do ZF
            unset($arrParametros['action']);
            unset($arrParametros['controller']);
            unset($arrParametros['module']);

            if (!$arrParametros['id_questionario_grte']) {
                throw new Exception('Questionário não identificado.');
            }

            $dadosUsuario = Zend_Auth::getInstance()->getIdentity();
            $arrParametros['id_usuario_cadastro'] = $dadosUsuario->id_usuario;

            //Verificando o id do anexo
            if (!$arrParametros['id_questionario_grte_anx01']) {
                unset($arrParametros['id_questionario_grte_anx01']);
            }

            //Setando null para os campos vazios
            foreach ($arrParametros as $key => $value) {
                if (!$value) {
                    $arrParametros[$key] = new Zend_Db_Expr('NULL');
                }
            }

            $objAnexoUmGrte = new AnexoUmGrte();
            $objAnexoUmGrte->salvar($arrParametros);

            $arrReturn['msn'] = "Anexo salvo com sucesso!";
            $arrReturn['type'] = "success";
        } catch (Exception $e) {

            $arrReturn['msn'] = $e->getMessage();
            $arrReturn['type'] = "error";
        }

        echo Zend_Json_Encoder::encode($arrReturn);

        die();
    }

    public function ajaxCarregarAnexoDoisAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $arrParametros = $this->_request->getParams();

        //Apagando dados de controle do ZF
        unset($arrParametros['action']);
        unset($arrParametros['controller']);
        unset($arrParametros['module']);

        $objAnexoDois = new AnexoDoisGrte();

        $arrDados = $objAnexoDois->getAnexoDois($arrParametros['id_questionario_grte_anx02']);

        if ($arrDados) {
            echo Zend_Json_Encoder::encode($arrDados[0]);
        } else {
            echo Zend_Json_Encoder::encode(array());
        }

        die();
    }

    public function ajaxSalvarAnexoDoisAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        try {

            $arrParametros = $this->_request->getParams();

            //Apagando dados de controle do ZF
            unset($arrParametros['action']);
            unset($arrParametros['controller']);
            unset($arrParametros['module']);

            if (!$arrParametros['id_questionario_grte']) {
                throw new Exception('Questionário não identificado.');
            }

            //Setando ID do usuário logado
            $dadosUsuario = Zend_Auth::getInstance()->getIdentity();
            $arrParametros['id_usuario_cadastro'] = $dadosUsuario->id_usuario;

            //Verificando o id do anexo
            if (!$arrParametros['id_questionario_grte_anx02']) {
                unset($arrParametros['id_questionario_grte_anx02']);
            }

            //Setando null para os campos vazios
            foreach ($arrParametros as $key => $value) {
                if (!$value) {
                    $arrParametros[$key] = new Zend_Db_Expr('NULL');
                }
            }

            $objAnexoDoisGrte = new AnexoDoisGrte();
            $objAnexoDoisGrte->salvar($arrParametros);

            $arrReturn['msn'] = "Anexo salvo com sucesso!";
            $arrReturn['type'] = "success";
        } catch (Exception $e) {

            $arrReturn['msn'] = $e->getMessage();
            $arrReturn['type'] = "error";
        }

        echo Zend_Json_Encoder::encode($arrReturn);

        die();
    }

    public function gridGrteAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $objquestionarioGrte = new QuestionarioGrte();

        $arrDados = $objquestionarioGrte->getGrid($this->_request->getParam('codigo_grte'));

        foreach ($arrDados as $key => $value) {
            $arrDados[$key]['delete'] = array('type' => 'delete-icon', 'label' => false,
                'clickMethod' => 'deleteGrid', "paramsClickMethod" => array('id_questionario_grte'));
        }

        $configGrid = array(
            "id" => "idGrid1",
            "header" => array(
                'Data do Levantamento' => array("charset" => 'UTF-8', "type" => "visible", "index" => "data_levantamento"),
                'Pesquisador' => array("charset" => 'UTF-8', "type" => "visible", "index" => "nome_pesquisador"),
                'delete' => array("charset" => 'UTF-8', 'type' => 'button', 'index' => 'delete', 'header' => false)
            ),
            "hasPaginator" => true,
            "clickMethod" => 'onClickGrid',
            "paramsClickMethod" => array('id_questionario_grte'),
            "rowClickable" => true,
            "deleteButton" => true,
            "countPerPage" => 10,
            "data" => $arrDados,
            "currentPageNumber" => $this->_request->getPost('page')
        );

        $grid = new Base_Grid($configGrid);
        echo $grid->generate();
    }

    public function ajaxDeleteGrteAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $objquestionarioGrte = new QuestionarioGrte();
        $objAnexoUmGrte = new AnexoUmGrte();
        $objAnexoDoisGrte = new AnexoDoisGrte();

        $idquestionarioGrte = $this->_request->getParam('id_questionario_grte');

        try {
            $objAnexoUmGrte->delete("id_questionario_grte = {$idquestionarioGrte}");
            $objAnexoDoisGrte->delete("id_questionario_grte = {$idquestionarioGrte}");
            $objquestionarioGrte->delete("id_questionario_grte = {$idquestionarioGrte}");

            $arrReturn['msn'] = "Questionário excluído com sucesso.";
            $arrReturn['type'] = "success";
        } catch (Exception $e) {
            $arrReturn['msn'] = $e->getMessage();
            $arrReturn['type'] = "error";
        }

        echo Zend_Json_Encoder::encode($arrReturn);
        die();
    }

    public function ajaxDeleteGrteAnexoUmAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $objAnexoUmGrte = new AnexoUmGrte();

        $idQuestionarioGrteAnx1 = $this->_request->getParam('id_questionario_grte_anx01');

        try {
            $objAnexoUmGrte->delete("id_questionario_grte_anx01 = {$idQuestionarioGrteAnx1}");

            $arrReturn['msn'] = "Anexo excluído com sucesso.";
            $arrReturn['type'] = "success";
        } catch (Exception $e) {
            $arrReturn['msn'] = $e->getMessage();
            $arrReturn['type'] = "error";
        }

        echo Zend_Json_Encoder::encode($arrReturn);
        die();
    }

    public function ajaxDeleteGrteAnexoDoisAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $objAnexoDoisGrte = new AnexoDoisGrte();

        $idQuestionarioGrteAnx2 = $this->_request->getParam('id_questionario_grte_anx02');

        try {
            $objAnexoDoisGrte->delete("id_questionario_grte_anx02 = {$idQuestionarioGrteAnx2}");

            $arrReturn['msn'] = "Anexo excluído com sucesso.";
            $arrReturn['type'] = "success";
        } catch (Exception $e) {
            $arrReturn['msn'] = $e->getMessage();
            $arrReturn['type'] = "error";
        }

        echo Zend_Json_Encoder::encode($arrReturn);
        die();
    }

    public function gridAnexoUmGrteAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $objAnexoUmGrte = new AnexoUmGrte();

        $arrDados = $objAnexoUmGrte->getGrid($this->_request->getParam('id_questionario_grte'));

        foreach ($arrDados as $key => $value) {
            $arrDados[$key]['delete'] = array('type' => 'delete-icon', 'label' => false,
                'clickMethod' => 'deleteGridAnexo1', "paramsClickMethod" => array('id_questionario_grte_anx01'));
        }

        $configGrid = array(
            "id" => "idGrid1",
            "header" => array(
                'Nome' => array("charset" => 'UTF-8', "type" => "visible", "index" => "nome"),
                'SD' => array("charset" => 'UTF-8', "type" => "visible", "index" => "area_sd"),
                'CTPS' => array("charset" => 'UTF-8', "type" => "visible", "index" => "area_ctps"),
                'Capt. Ativa' => array("charset" => 'UTF-8', "type" => "visible", "index" => "area_capt_ativa"),
                'Rec. Adm.' => array("charset" => 'UTF-8', "type" => "visible", "index" => "area_rec_adm"),
                'delete' => array("charset" => 'UTF-8', 'type' => 'button', 'index' => 'delete', 'header' => false)
            ),
            "hasPaginator" => true,
            "clickMethod" => 'onClickGridAnexo1',
            "paramsClickMethod" => array('id_questionario_grte_anx01'),
            "rowClickable" => true,
            "deleteButton" => true,
            "countPerPage" => 5,
            "data" => $arrDados,
            "currentPageNumber" => $this->_request->getPost('page')
        );

        $grid = new Base_Grid($configGrid);
        echo $grid->generate();
    }

    public function gridAnexoDoisGrteAction() {

        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $objAnexoDoisGrte = new AnexoDoisGrte();


        $arrDados = $objAnexoDoisGrte->getGrid($this->_request->getParam('id_questionario_grte'));

        foreach ($arrDados as $key => $value) {

            $arrDados[$key]['delete'] = array('type' => 'delete-icon', 'label' => false,
                'clickMethod' => 'deleteGridAnexo2', "paramsClickMethod" => array('id_questionario_grte_anx02'));

            switch ($value['codigo_meta']) {

                case '1':
                    $arrDados[$key]['codigo_meta'] = "Requerentes totais de serviços do Seguro-Desemprego";
                    break;
                case '2':
                    $arrDados[$key]['codigo_meta'] = "Requerentes do benefício do Seguro-Desemprego";
                    break;
                case '3':
                    $arrDados[$key]['codigo_meta'] = "Requerentes do Seguro-Desemprego encaminhados para cursos de qualificação";
                    break;
                case '4':
                    $arrDados[$key]['codigo_meta'] = "Requerentes do Seguro-Desemprego encaminhados para vaga de trabalho";
                    break;
                case '5':
                    $arrDados[$key]['codigo_meta'] = "Requerentes do Seguro-Desemprego colocados por meio do Sine";
                    break;
                case '6':
                    $arrDados[$key]['codigo_meta'] = "Trabalhadores inscritos no Sine";
                    break;
                case '7':
                    $arrDados[$key]['codigo_meta'] = "Trabalhadores inscritos no Sine e encaminhados para cursos de qualificação";
                    break;
                case '8':
                    $arrDados[$key]['codigo_meta'] = "Trabalhadores colocados";
                    break;
                case '9':
                    $arrDados[$key]['codigo_meta'] = "Vagas captadas";
                    break;
                case '10':
                    $arrDados[$key]['codigo_meta'] = "Encaminhados";
                    break;
                case '11':
                    $arrDados[$key]['codigo_meta'] = "Quantidade média de atendimentos de serviços de CTPS realizados por dia";
                    break;
                case '12':
                    $arrDados[$key]['codigo_meta'] = "Quantidade de CTPS solicitadas";
                    break;
                case '13':
                    $arrDados[$key]['codigo_meta'] = "Quantidade de Recursos Administrativos Recebidos";
                    break;
                case '14':
                    $arrDados[$key]['codigo_meta'] = "Quantidade de Recursos Administrativos Deferidos";
                    break;
                case '15':
                    $arrDados[$key]['codigo_meta'] = "Quantidade de Recursos Administrativos Indeferidos";
                    break;
                case '16':
                    $arrDados[$key]['codigo_meta'] = "Outro";
                    break;
            }

            if ($value['utiliza'] == 's') {
                $arrDados[$key]['utiliza'] = 'Sim';
            } else {
                $arrDados[$key]['utiliza'] = 'Não';
            }
        }

        $configGrid = array(
            "id" => "idGrid1",
            "header" => array(
                'Código Meta' => array("charset" => 'UTF-8', "type" => "visible", "index" => "codigo_meta"),
                'Utiliza' => array("charset" => 'UTF-8', "type" => "visible", "index" => "utiliza"),
                'delete' => array("charset" => 'UTF-8', 'type' => 'button', 'index' => 'delete', 'header' => false)
            ),
            "hasPaginator" => true,
            "clickMethod" => 'onClickGridAnexo2',
            "paramsClickMethod" => array('id_questionario_grte_anx02'),
            "rowClickable" => true,
            "deleteButton" => true,
            "countPerPage" => 5,
            "data" => $arrDados,
            "currentPageNumber" => $this->_request->getPost('page')
        );

        $grid = new Base_Grid($configGrid);
        echo $grid->generate();
    }

}
