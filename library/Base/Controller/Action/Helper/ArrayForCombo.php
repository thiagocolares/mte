<?php
class Base_Controller_Action_Helper_ArrayForCombo extends Zend_Controller_Action_Helper_Abstract {

    /**
     *
     * @param <type> $key Valor que a combo retornará
     * @param <type> $value Valor a ser apresentado dentro da combo
     * @param array $data Valores da combo
     * @param <type> $init Primeiro valor da combo
     * @return array $array
     *
     * Prepara o array de retorno do banco para utilização em combos
     */
    public function arrayforcombo($key, $value, array $data, $init = 'Selecione'){

        if($init != null){
            $array[''] = $init;
        }
        
        if(sizeof($data)){            
            foreach ($data as $chave => $valor ){                
                $array[$valor[$key]] = $valor[$value];
            }            
        }else{
            $array[''] = 'Sem registros';
        }

        return $array;
    }    
}