<?php
class Base_Controller_Action_Helper_BaseUrl extends Zend_Controller_Action_Helper_Abstract {

    public function direct() {
        return $this->baseurl();
    }

    public function baseurl() {
        $fc = Zend_Controller_Front::getInstance();
        return $fc->getBaseUrl();
    }
}