<?php

namespace AppBundle\Controller;

use Pusher;
use SimpleXMLElement;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Annotation\Route;

class CallbackController extends Controller
{

    /**
     * @Route("/callback/esendex/{id}", name="callback_esendex")
     * @param Request $request
     *
     * @param         $id
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function esendex(Request $request, $id)
    {
        $this->checkAccess($id);

        $parsedData = $this->parseContent($request->getContent());

        $options = array(
            'cluster' => 'eu',
            'encrypted' => true
        );
        $pusher = new Pusher(
            $this->getParameter('pusher_app_key'),
            $this->getParameter('pusher_app_secret'),
            $this->getParameter('pusher_app_id'),
            $options
        );

        $data['message'] = 'hello world';
        $pusher->trigger('test_channel', 'fuck-shit-up', ['message' => $parsedData['MessageText']]);

        return $this->render(':callback:esendex.html.twig');
    }

    /**
     * @param $id
     */
    private function checkAccess($id)
    {
        if ($id != $this->getParameter('callback_esendex_id')) {
            throw new AccessDeniedHttpException;
        }
    }

    private function parseContent($content)
    {
        $xml = simplexml_load_string($content, "SimpleXMLElement", LIBXML_NOCDATA);
        $json = json_encode($xml);

        return json_decode($json, true);
    }
}