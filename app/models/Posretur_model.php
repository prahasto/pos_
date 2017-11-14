<?php
/**
 * Created by PhpStorm.
 * User: Aji
 * Date: 13-11-2017
 * Time: 10:04
 */

class Posretur_model extends CI_Model
{
    public function __construct() {
        parent::__construct();
    }

    public function getSaleByID($sale_id) {
        $q = $this->db->get_where('sales', array('id' => $sale_id), 1);
        if( $q->num_rows() > 0 ) {
            return $q->row();
        }
        return FALSE;
    }

    public function getAllSaleItems($sale_id) {
        $j = "(SELECT id, code, name, tax_method from {$this->db->dbprefix('products')}) P";
        $this->db->select("sale_items.*,
            (CASE WHEN {$this->db->dbprefix('sale_items')}.product_code IS NULL THEN {$this->db->dbprefix('products')}.code ELSE {$this->db->dbprefix('sale_items')}.product_code END) as product_code,
            (CASE WHEN {$this->db->dbprefix('sale_items')}.product_name IS NULL THEN {$this->db->dbprefix('products')}.name ELSE {$this->db->dbprefix('sale_items')}.product_name END) as product_name,
            {$this->db->dbprefix('products')}.tax_method as tax_method", FALSE)
            ->join('products', 'products.id=sale_items.product_id', 'left outer')
            ->order_by('sale_items.id');
        $q = $this->db->get_where('sale_items', array('sale_id' => $sale_id));
        if($q->num_rows() > 0) {
            foreach (($q->result()) as $row) {
                $data[] = $row;
            }
            return $data;
        }
        return FALSE;
    }

    public function getSales($term, $limit = 10) {
        //$store_id = $this->session->userdata('store_id');
        $this->db->select("{$this->db->dbprefix('sales')}.*");
        $this->db->select('id,customer_name, total');
       // $this->db->like('customer_name', $term);
        $this->db->like('salesno', $term);
        //$this->db->or_like('salesno', $term);

        $q = $this->db->get('sales');
        if ($q->num_rows() > 0) {
            foreach (($q->result()) as $row) {
                $data[] = $row;
            }
            return $data;
        }
        return FALSE;
    }

    public function registerData($user_id = NULL) {
        if (!$user_id) {
            $user_id = $this->session->userdata('user_id');
        }
        $q = $this->db->get_where('registers', array('user_id' => $user_id, 'status' => 'open'), 1);
        if ($q->num_rows() > 0) {
            return $q->row();
        }
        return FALSE;
    }


}