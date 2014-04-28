<?php

class AnexoDoisGrte extends Base_Db_Table {

    protected $_name = "questionario_grte_anx02";
    protected $_primary = "id_questionario_grte_anx02";

    public function getGrid($idQuestGrte) {

        if ($idQuestGrte) {
            $db = $this->getAdapter();

            $select = "SELECT * from questionario_grte_anx02 WHERE id_questionario_grte = {$idQuestGrte}";

            $rs = $db->fetchAll($select);

            return $rs;
        } else {
            return array();
        }
    }

    public function salvar($arrDados = array()) {

        if (!isset($arrDados['id_questionario_grte_anx02'])) {
            //Anexo novo
            $arrDados['id_questionario_grte_anx02'] = $this->insert($arrDados);
        } else {
            //Anexo já existente
            $this->update($arrDados, "id_questionario_grte_anx02 = {$arrDados['id_questionario_grte_anx02']}");
        }

        return $arrDados['id_questionario_grte_anx02'];
    }

    public function getAnexoDois($idQuestionarioGrteAnx02) {

        if ($idQuestionarioGrteAnx02) {
            $db = $this->getAdapter();

            $select = "SELECT * from questionario_grte_anx02 WHERE id_questionario_grte_anx02 = {$idQuestionarioGrteAnx02}";

            $rs = $db->fetchAll($select);

            return $rs;
        } else {
            return array();
        }
    }

}
