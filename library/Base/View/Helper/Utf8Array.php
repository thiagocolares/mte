<?php

class Base_View_Helper_Utf8Array extends Zend_View_Helper_Abstract {

    private $array;

    public function utf8Array($array){
        $this->array = (array)$array;
        return $this;
    }

    public function encode(){
        return $this->makeArray($this->array, 'utf8_encode');
    }

    public function decode(){
        return $this->makeArray($this->array, 'utf8_decode');
    }

    public function makeArray($input, $function){
        $output = null;
        if(is_array($input)){
            foreach ($input as $k => $val){
                $output[$k] = $this->makeArray($val, $function);
            }
        }else{
            if(is_string($input)){
                return $function($input);
            }else{
                return $input;
            }
            
        }
        return $output;
    }


}
