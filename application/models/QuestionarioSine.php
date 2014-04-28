<?php

class QuestionarioSine extends Base_Db_Table {

    protected $_name = "questionario_sine";
    protected $_primary = "id_questionario_sine";

    public function getGrid($codigoPosto) {

        if ($codigoPosto) {
            $db = $this->getAdapter();

            $select = "SELECT * from questionario_sine WHERE codigo_posto = '{$codigoPosto}'";

            $rs = $db->fetchAll($select);

            return $rs;
        } else {
            return array();
        }
    }

    public function getQuestionarioSine($idQuestionarioSine) {
        
        $db = $this->getAdapter();
        
        $select = "SELECT * from questionario_sine WHERE id_questionario_sine = '{$idQuestionarioSine}'";

        $rs = $db->fetchAll($select);

        return $rs;
        
    }

    public function salvar($arrDados = array()) {

        if (!isset($arrDados['id_questionario_sine']) || !$arrDados['id_questionario_sine']) {
            //Questionário novo
            $arrDados['id_questionario_sine'] = $this->insert($arrDados);
        } else {
            //Questionário já existente
            $this->update($arrDados, "id_questionario_sine = {$arrDados['id_questionario_sine']}");
        }

        return $arrDados['id_questionario_sine'];
    }

}
