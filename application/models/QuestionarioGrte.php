<?php

class QuestionarioGrte extends Base_Db_Table {

    protected $_name = "questionario_grte";
    protected $_primary = "id_questionario_grte";

    public function getGrid($codigoPosto) {

        if ($codigoPosto) {
            $db = $this->getAdapter();

            $select = "SELECT * from questionario_grte WHERE codigo_posto = '{$codigoPosto}'";

            $rs = $db->fetchAll($select);

            return $rs;
        } else {
            return array();
        }
    }

    public function getQuestionarioGrte($idQuestionarioGrte) {
        
        $db = $this->getAdapter();
        
        $select = "SELECT * from questionario_grte WHERE id_questionario_grte = '{$idQuestionarioGrte}'";

        $rs = $db->fetchAll($select);

        return $rs;
        
    }

    public function salvar($arrDados = array()) {

        if (!isset($arrDados['id_questionario_grte']) || !$arrDados['id_questionario_grte']) {
            //Questionário novo
            $arrDados['id_questionario_grte'] = $this->insert($arrDados);
        } else {
            //Questionário já existente
            $this->update($arrDados, "id_questionario_grte = {$arrDados['id_questionario_grte']}");
        }

        return $arrDados['id_questionario_grte'];
    }

}
