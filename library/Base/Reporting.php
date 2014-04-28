<?php
/**
 * Classe responsável por integrar o componente em JAVA para geração de relatórios com a estrutura PHP em Zend Framework
 *
 * @package reports
 * @author Adler Medrado
 */
class Base_Reporting
{
	/**
	 * Método que executa o programa JAVA que gera o relatório
	 *
	 * @param string $relName Nome do Relatório
	 * @param array $relParams Array com os parâmetros necessários para gerar o relatorio
	 * @return String - Deverá ser retornado o caminho para o relatório gerado ou uma mensagem de erro que deverá ser tratada 
	 * no controller pelo programador
	 * @author Adler Medrado
	 */
	public static function generate($tipoRelatorio, $relName, array $relParams)
	{
		
		$pathToReporting = realpath(APPLICATION_PATH . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'library');
		
		$command  = 'java -jar ';
		//$command .= $pathToReporting . DIRECTORY_SEPARATOR . 'Reporting' . DIRECTORY_SEPARATOR;
		$command .= '../library/Reporting/';
		$command .= 'Relatorio.jar ';
		$command .= " {$tipoRelatorio} ";
		$command .= " {$relName} ";
		$command .= implode(" ", $relParams);
		// Imprime o comando que será executado na tela.
	     //var_dump($command);	    
		
		$output = shell_exec($command);
		self::cleanup();
		
		return $output;
	}
	
	/**
	 * Calcula as datas que deverão ser verificadas ao analisar quais arquivos deverão ser apagados do diretório
	 * É retornada a data base em formato timestamp para checagem das datas dos arquivos
     *	
	 * @return String
	 * @author Adler Medrado
	 */
	private static function getTime() 
	{
		$config = new Zend_Config_Ini(APPLICATION_PATH . '/configs/application.ini', APPLICATION_ENV);
		
		$secondsToClean = $config->cleanup_time;
		$secondsToClean = 1000;
		$currentTime    = time();
		$timeToCheck    = $currentTime - $secondsToClean;
		
		return $timeToCheck;
	}
	
	/**
	 * Realizar a limpeza do diretório reports, removendo todos os relatórios gerados cuja data de criação do arquivo seja 
	 * maior ou igual ao limite de tempo determinado.
	 *
	 * @return void
	 * @author Adler Medrado
	 */
	protected static function cleanup() 
	{
		$pathToReports = realpath(
								    APPLICATION_PATH 
								  . DIRECTORY_SEPARATOR 
								  . '..' 
								  . DIRECTORY_SEPARATOR 
								  . 'public' 
								  . DIRECTORY_SEPARATOR 
								  . 'reports'
								 );
								
		foreach (new DirectoryIterator( $pathToReports ) as $file) {
		    
			if($file->isDot()) continue;
			if ($file->getFilename() == '.svn') continue;
			
			if ($file->getMtime() <= self::getTime()) {
				unlink($file->getRealPath());
			}
		}
		
	}
	
}